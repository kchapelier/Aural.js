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

Aural.Music.Note.midi = null;
Aural.Music.Note.cents = null;
Aural.Music.Note.label = null;
Aural.Music.Note.octave = null;
Aural.Music.Note.frequency = null;

Aural.Music.Note.prototype.initializeFromFrequency = function(frequency) {
	var midi = Aural.Music.Note.getMidiFromFrequency(frequency);
	var label = Aural.Music.Note.getLabelFromMidi(midi[0]);
	
	this.label = label[0];
	this.octave = label[1];
	this.midi = midi[0];
	this.cents = midi[1];
	this.frequency = frequency;
};

Aural.Music.Note.prototype.initializeFromLabel = function(label, octave, cents) {

	var transposition = 0;
	
	if(cents) {
		transposition = Math.floor(cents / 100);
		cents = cents % 100;
	} else {
		cents = 0;
	}

	octave = octave || null;
	
	if(octave === null) {
		//try to get the octave from the label
		label = Aural.Music.Note.parseLabel(label);
		octave = label[1];
		label = label[0];
	}
	
	this.midi = Aural.Music.Note.getMidiFromLabel(label, octave);
	this.frequency = Aural.Music.Note.getFrequencyFromMidi(this.midi, cents);
	this.cents = cents;
	this.label = label;
	this.octave = octave;
	
	if(transposition) {
		this.transpose(transposition);
	}
};

Aural.Music.Note.prototype.initializeFromMidi = function(midi, cents) {
	if(cents) {
		midi+= Math.floor(cents / 100);
		cents = cents % 100;
	} else {
		cents = 0;
	}
	
	var label = Aural.Music.Note.getLabelFromMidi(midi);
	
	this.label = label[0];
	this.octave = label[1];
	
	this.frequency = Aural.Music.Note.getFrequencyFromMidi(midi, cents);
	
	this.midi = midi;
	this.cents = cents;
};

Aural.Music.Note.prototype.getHarmonic = function(harmonic) {
	var note = Aural.Music.Note.createFromFrequency(this.frequency * harmonic);
	return note;
};

Aural.Music.Note.prototype.getHarmonicSeries = function(number) {
	var harmonics = [];
	
	number = Math.max(1, number);
	
	for(var i = 1; i <= number; i++) {
		harmonics.push(this.frequency * i);
	}
	
	return harmonics;
};

Aural.Music.Note.prototype.transpose = function(transposition, cents) {
	this.midi += transposition;
	
	if(cents) {
		this.cents += cents;
	}
	
	this.initializeFromMidi(this.midi, this.cents);
};

Aural.Music.Note.notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
Aural.Music.Note.middleA = 440;

Aural.Music.Note.createFromFrequency = function(frequency) {
	return new Aural.Music.Note(null, null, null, null, frequency);
}

Aural.Music.Note.createFromMidi = function(midi, cents) {
	return new Aural.Music.Note(null, null, midi, cents, null);
}

Aural.Music.Note.createFromLabel = function(label, octave, cents) {
	return new Aural.Music.Note(label, octave, null, cents, null);
}

Aural.Music.Note.getLabelFromMidi = function(midi) {
	var rationalized = midi % 12;
	var octave = Math.floor(midi / 12) - 1;
	var label = this.notes[rationalized];
	
	return [label, octave];
};

Aural.Music.Note.getFrequencyFromMidi = function(midi, cents) {
	console.log(cents);
	cents = cents || 0;
	
	return this.middleA * Math.pow(2, (midi - 69 + (cents / 100)) / 12); //hardcoded twelve tone equal temperament
};

Aural.Music.Note.parseLabel = function(label) {
	var match = label.match(/([0-9]+)$/g);
	var octave = null;
	
	if(match && match[0]) {
		label = label.substr(0, label.length - match[0].length);
		octave = parseInt(match[0]);
	}
	
	return [label, octave];
};

Aural.Music.Note.getMidiFromLabel = function(label, octave) {
	octave = octave || null;
	
	if(octave === null) {
		//try to get the octave from the label
		label = Aural.Music.Note.parseLabel(label);
		octave = label[1];
		label = label[0];
	}
	
	return this.notes.indexOf(label) + (octave + 1) * 12;
};

Aural.Music.Note.getMidiFromFrequency = function(frequency) {
	var m = Math.log(frequency / this.middleA) / Math.log(2) * 12 + 69;
	var midi = Math.round(m);
	var cents = (m - midi) * 100;
	
	return [midi, cents]
};