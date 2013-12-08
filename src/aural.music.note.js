"use strict";

Aural.Music.Note = function(label, octave, midi, cents, frequency) {
	if(midi !== null) {
		this.initializeFromMidi(midi, cents);
	} else if(frequency !== null) {
		this.initializeFromFrequency(frequency);
	} else {
		this.initializeFromLabel(label, octave, cents);
	}
};

Aural.Music.Note.prototype.midi = null;
Aural.Music.Note.prototype.cents = null;
Aural.Music.Note.prototype.label = null;
Aural.Music.Note.prototype.octave = null;
Aural.Music.Note.prototype.frequency = null;

/**
 * Initialize the note base on a frequency
 * @param {float} frequency - Frequency in hertz
 */
Aural.Music.Note.prototype.initializeFromFrequency = function(frequency) {
	var midi = Aural.Music.Note.getMidiFromFrequency(frequency);
	
	var label = Aural.Music.Note.getLabelFromMidi(midi[0]);
	
	this.label = label[0];
	this.octave = label[1];
	this.midi = midi[0];
	this.cents = midi[1];
	this.frequency = Math.abs(frequency);
};

/**
 * Initialize the note base on a label, octave and cents
 * @param {string} label - Label of the note (ie : C, D#, G5, F#3, ...)
 * @param {integer} octave - Octave (if not already specified in the label)
 * @param {float} cents - Cents
 */
Aural.Music.Note.prototype.initializeFromLabel = function(label, octave, cents) {
	cents = cents | 0;

	label = Aural.Music.Note.parseLabel(label);
	octave = octave || label[1];
	label = label[0];

	this.midi = Aural.Music.Note.getMidiFromLabel(label, octave);
	this.frequency = Aural.Music.Note.getFrequencyFromMidi(this.midi, cents);
	this.cents = cents;
	this.label = label;
	this.octave = octave;
};

/**
 * Initialize the note base on a midi value and cents
 * @param {integer} midi - Midi value
 * @param {float} cents - Cents
 */
Aural.Music.Note.prototype.initializeFromMidi = function(midi, cents) {
	cents = cents | 0;

	var label = Aural.Music.Note.getLabelFromMidi(midi);
	
	this.label = label[0];
	this.octave = label[1];
	
	this.frequency = Aural.Music.Note.getFrequencyFromMidi(midi, cents);
	
	this.midi = midi;
	this.cents = cents;
};


/**
 * Get the period of the note in millisecond
 * @return {float} Period
 */
Aural.Music.Note.prototype.getPeriod = function() {
	return 1000 / this.frequency;
};

/**
 * Get the 'solfege' name of the note
 * @param {boolean} Whether to use the roman labels
 * @returns {string} Solfege name (ie: Do, Mi#, ...)
 */
Aural.Music.Note.prototype.getSolfegeName = function(asRoman) {
	var rationalized = this.midi % 12;
	
	if(rationalized < 0) {
		rationalized+= 12;
	}

	return asRoman ? Aural.Music.Note.romanSolfegeName[rationalized] : Aural.Music.Note.solfegeName[rationalized];
};

/**
 * Get the specified harmonic as a Note object
 * @param {integer} harmonic - Harmonic degree (1 to infinity)
 * @returns {Aural.Music.Note} Harmonic
 */
Aural.Music.Note.prototype.getHarmonic = function(harmonic) {
	var note = Aural.Music.Note.createFromFrequency(this.frequency * harmonic);
	return note;
};

/**
 * Get a list of harmonics as frequencies
 * @param {integer} number - Number of harmonics to return, starting from the fundamental
 * @returns {float[]} Frequencies
 */
Aural.Music.Note.prototype.getHarmonicSeries = function(number) {
	var harmonics = [];
	
	number = Math.max(1, number);
	
	for(var i = 1; i <= number; i++) {
		harmonics.push(this.frequency * i);
	}
	
	return harmonics;
};

/**
 * Set the amount of cents of the note
 * @param {float} cents - Cents
 */
Aural.Music.Note.prototype.setCents = function(cents) {
	this.transpose(0, cents - this.cents);
};

/**
 * Transpose the note from a certain number of semitones and/or cents
 * @param {integer} transposition - Number of semitones
 * @param {float} cents - Cents
 * @return {[type]} [description]
 */
Aural.Music.Note.prototype.transpose = function(transposition, cents) {
	this.midi += transposition;
	
	if(cents) {
		this.cents += cents;
	}
	
	this.initializeFromMidi(this.midi, this.cents);
};

/**
 * Transpose the note from a certain number of intervals
 * @param {string|Aural.Music.Interval} interval - Interval (name or object)
 * @param {integer} multiplier - Multiplier
 */
Aural.Music.Note.prototype.applyInterval = function(interval, multiplier) {
	multiplier = multiplier || 1;

	if(typeof interval == 'string') {
		interval = Aural.Music.IntervalList.getInterval(interval);
	}

	if(interval) {
		var transpose = Math.floor(interval.cents / 100);
		var restCents = interval.cents % 100;

		this.transpose(transpose * multiplier, restCents * multiplier);
	}
};

/**
 * Get a copy of the note
 * @return {Aural.Music.Note} Copy of the note
 */
Aural.Music.Note.prototype.copy = function() {
	return Aural.Music.Note.createFromMidi(this.midi, this.cents);
};

Aural.Music.Note.notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
Aural.Music.Note.solfegeName = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Ti'];
Aural.Music.Note.romanSolfegeName = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

/**
 * Create a Note object from a frequency
 * @param {float} frequency - Frequency in hertz
 * @return {Aural.Music.Note} Note object
 */
Aural.Music.Note.createFromFrequency = function(frequency) {
	return new Aural.Music.Note(null, null, null, null, frequency);
};

/**
 * Create a Note object from a midi value
 * @param {integer} midi - Midi value
 * @param {float} cents - Cents
 * @return {Aural.Music.Note} Note object
 */
Aural.Music.Note.createFromMidi = function(midi, cents) {
	return new Aural.Music.Note(null, null, midi, cents, null);
};

/**
 * Create a Note object from a label
 * @param {string} label - Label of the note (ie : C, D#, G5, F#3, ...)
 * @param {integer} octave - Octave (if not already specified in the label)
 * @param {float} cents - Cents
 * @return {Aural.Music.Note} Note object
 */
Aural.Music.Note.createFromLabel = function(label, octave, cents) {
	return new Aural.Music.Note(label, octave, null, cents, null);
};

/**
 * Get the label (and octave) from a given midi value
 * @param {integer} midi - Midi value
 * @returns {array} Array with the label and the octave (ie: ['C', 6])
 */
Aural.Music.Note.getLabelFromMidi = function(midi) {
	var rationalized = midi % 12;

	if(rationalized < 0) {
		rationalized = 12 + rationalized;
	}

	var octave = Math.floor(midi / 12) - 1;
	var label = this.notes[rationalized];
	
	return [label, octave];
};

/**
 * Get the frequency matching a given midi value (and cents)
 * @param {integer} midi - Midi value
 * @param {float} cents - Cents
 * @returns {float} Frequency in hertz
 */
Aural.Music.Note.getFrequencyFromMidi = function(midi, cents) {
	cents = cents || 0;
	return Aural.Music.Tuning.middleA * Math.pow(2, (midi - 69 + (cents / 100)) / 12); //hardcoded twelve tone equal temperament
};

/**
 * Parse a note label to extract its octave
 * @param {string} label - Label (ie: C6)
 * @returns {array} Array with the label and the octave (ie: ['C', 6])
 */
Aural.Music.Note.parseLabel = function(label) {
	var regex = /^([CDEFGAB])([b#]?)(-?[0-9]*)$/g;
	var match = regex.exec(label);
	
	label = match[1];
	var modifier = match[2];
	var octave = parseInt(match[3], 10);
	if(isNaN(octave)) {
		octave = 0;
	}

	var pos = this.notes.indexOf(label) || 0;

	switch(modifier) {
		case '#':
			pos++;
			break;
		case 'b':
			pos--;
			break;
	}

	if(pos < 0) {
		pos+=12;
		octave--;
	} else if(pos >= 12) {
		pos-= 12;
		octave++;
	}

	label = this.notes[pos];

	return [label, octave];
};

/**
 * Get the midi value (and cents) matching a given note identified by its label and octave
 * @param {string} label - Label of the note (ie : C, D#, G5, F#3, ...)
 * @param {integer|null} octave - Octave (if not already specified in the label)
 * @returns {integer} Midi value
 */
Aural.Music.Note.getMidiFromLabel = function(label, octave) {
	label = Aural.Music.Note.parseLabel(label);
	octave = octave || label[1];
	label = label[0];
	
	return this.notes.indexOf(label) + (octave + 1) * 12;
};

/**
 * Get the midi value (and cents) matching a given frequency
 * @param {float} frequency - Frequency in hertz
 * @returns {array} Array with the midi value and the cents
 */
Aural.Music.Note.getMidiFromFrequency = function(frequency) {
	var m = Math.log(Math.abs(frequency) / Aural.Music.Tuning.middleA) / Math.log(2) * 12 + 69;
	var midi = Math.round(m);
	var cents = (m - midi) * 100;
	
	return [midi, cents]
};