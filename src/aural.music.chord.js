"use strict";

Aural.Music.Chord = function(intervals, shortname, name, key) {
	this.name = name;
	this.shortname = shortname;
	this.intervals = intervals;
	this.key = key || 'C';
};

Aural.Music.Scale.prototype.intervals = null;
Aural.Music.Scale.prototype.name = null;
Aural.Music.Scale.prototype.shortname = null;
Aural.Music.Scale.prototype.key = null;

/**
 * Get the type of the chord
 * @returns {string} Type
 **/
Aural.Music.Chord.prototype.getType = function() {
	switch(this.intervals.length) {
		case 1:
			return 'monad';
		case 2:
			return 'dyad';
		case 3:
			return 'triad';
		case 4:
			return 'tetrad';
		case 5:
			return 'pentad';
		case 6:
			return 'hexad';
		case 7:
			return 'heptad';
		case 8:
			return 'octad';
		case 9:
			return 'ennead';
		case 10:
			return 'decad';
		case 11:
			return 'undecad';
		case 12:
			return 'dodecad';
		default:
			return '';
	}
};

/**
 * Get all the notes from the chord
 * @returns {Aural.Music.Note[]} Notes
 */
Aural.Music.Chord.prototype.getNotes = function() {
	octave = octave || 0;

	var notes = [];
	var current = this.getKeyOffset();
	
	for(var i = 0, l = this.intervals.length; i < l; i++) {
		current += this.intervals[i];
		notes.push(Aural.Music.Note.createFromMidi(current));
		
	}
	
	return notes;
};

/**
 * Get all the notes of the chord as string
 * @returns {string[]} Labels of the notes
 */
Aural.Music.Chord.prototype.getNotesAsLabels = function() {
	var notes = [];
	var current = this.getKeyOffset();
	var label = null;
	
	for(var i = 0, l = this.intervals.length; i < l; i++) {
		current += this.intervals[i];
		label = Aural.Music.Note.getLabelFromMidi(current);
		notes.push(label[0]);
		
	}
	
	return notes;
};

/**
 * Define the key of the chord
 * @param {string} key - Key
 */
Aural.Music.Chord.prototype.setKey = function(key) {
	this.key = key;
};

/**
 * Transpose the chord
 * @param {integer} intervals - Number of intervals
 */
Aural.Music.Chord.prototype.transpose = function(intervals) {
	var offset = this.getKeyOffset() + intervals;
	var label = Aural.Music.Note.getLabelFromMidi(offset);
	this.key = label[0];
};

/**
 * Return the offset of the key from C
 * @returns {integer} Offset
 */
Aural.Music.Chord.prototype.getKeyOffset = function() {
	return Aural.Music.Note.getMidiFromLabel(this.key);
};

/**
 * Create a copy of this chord in another key
 * @param {string} key - Desired key (ie: C, D#, ...)
 * @returns {Aural.Music.Scale} Keyed chord
 */
Aural.Music.Chord.prototype.createCopy = function(key) {
	return new Aural.Music.Chord(this.intervals, this.shortname, this.name, key);
};