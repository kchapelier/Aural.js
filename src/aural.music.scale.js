"use strict";

/**
 * Create a scale
 * @param {string[]} titles - Array of possible titles
 * @param {Number[]} intervals - Successive intervals of the scale
 * @param {string} key - Name of the key (ie: C or G#)
 * @constructor
 * @classdesc Scale
 */
Aural.Music.Scale = function(titles, intervals, key) {
	this.titles = titles;
	this.intervals = intervals;
	this.setKey(key || 'C');
};

Aural.Music.Scale.prototype.titles = null;
Aural.Music.Scale.prototype.intervals = null;
Aural.Music.Scale.prototype.key = null;

Aural.Music.Scale.HEMITONIC_TYPE_BASIC = '';
Aural.Music.Scale.HEMITONIC_TYPE_COUNT = 'count';
Aural.Music.Scale.HEMITONIC_TYPE_SUCCESSION = 'succession';

/**
 * Get the hemitonic properties of the scale
 * @param {string} resultType - Desired properties
 * @returns {string}  
 */
Aural.Music.Scale.prototype.getHemitonicType = function(resultType) {
	var nbSemitone = 0;
	var maxSuccessive = 0;
	var previous = 0;
	var successive = 0;
	var i, l;

	for(i = 0, l = this.intervals.length; i < l; i++) {
		if(this.intervals[i] === 1) {
			nbSemitone++;
			
			if(previous === 1) {
				successive++;
				maxSuccessive = Math.max(maxSuccessive, successive);
			}
		}
		
		previous = this.intervals[i];
	}
	
	if(this.intervals.length < 12) {
		//iterating a second time to properly count the successive semitones
		for(i = 0, l = this.intervals.length; i < l; i++) {
			if(this.intervals[i] === 1) {
				if(previous === 1) {
					successive++;
					maxSuccessive = Math.max(maxSuccessive, successive);
				}
			}
			
			previous = this.intervals[i];
		}
	}
	
	switch(resultType) {
		case Aural.Music.Scale.HEMITONIC_TYPE_COUNT:
			switch(nbSemitone) {
				case 0:
					return 'anhemitonic';
				case 1:
					return 'unhemitonic';
				case 2:
					return 'dihemitonic';
				case 3:
					return 'trihemitonic';
				case 4:
					return 'tetrahemitonic';
				case 5:
					return 'pentahemitonic';
				case 6:
					return 'hexahemitonic';
				case 7:
					return 'heptahemitonic';
				case 8:
					return 'octahemitonic';
				case 9:
					return 'enneahemitonic';
				case 10:
					return 'decahemitonic';
				case 11:
					return 'undecahemitonic';
				default:
					return 'chromatic';
					
			}
			break;
		case Aural.Music.Scale.HEMITONIC_TYPE_SUCCESSION:
			return (nbSemitone > 0 ? (maxSuccessive > 1 ? 'cohemitonic' : 'ancohemitonic') : 'anhemitonic');
		default:
			return (nbSemitone > 0 ? 'hemitonic' : 'anhemitonic');
	}
};

/**
 * Get the type of the scale
 * @returns {string} Type
 **/
Aural.Music.Scale.prototype.getType = function() {
	switch(this.intervals.length) {
		case 1:
			return 'monotonic';
		case 2:
			return 'ditonic';
		case 3:
			return 'tritonic';
		case 4:
			return 'tetratonic';
		case 5:
			return 'pentatonic';
		case 6:
			return 'hexatonic';
		case 7:
			return 'heptatonic';
		case 8:
			return 'octatonic';
		case 9:
			return 'enneatonic';
		case 10:
			return 'decatonic';
		case 11:
			return 'undecatonic';
		case 12:
			return 'chromatic';
		default:
			return '';
	}
};

/**
 * Get all the notes from the scale
 * @param {Number} [octave=0] - Desired octave for the notes
 * @returns {Aural.Music.Note[]} Notes
 */
Aural.Music.Scale.prototype.getNotes = function(octave) {
	octave = octave || 0;

	var notes = [];
	var current = this.getKeyOffset();
	
	for(var i = 0, l = this.intervals.length; i < l; i++) {
		notes.push(Aural.Music.Note.createFromMidi(current + octave * 12));
		current += this.intervals[i];
	}
	
	return notes;
};

/**
 * Get all the notes of the scale as string
 * @returns {string[]} Labels of the notes
 */
Aural.Music.Scale.prototype.getNotesAsLabels = function() {
	var notes = [];
	var current = this.getKeyOffset();
	var label = null;
	
	for(var i = 0, l = this.intervals.length; i < l; i++) {
		label = Aural.Music.Note.getLabelFromMidi(current);
		notes.push(label[0]);
		current += this.intervals[i];
	}
	
	return notes;
};

/**
 * Get all the intervals of the scale
 * @return {Aural.Music.Interval[]} Array of intervals
 */
Aural.Music.Scale.prototype.getIntervals = function() {
	var intervals = [];
	var current = 0;

	for(var i = 0, l = this.intervals.length; i < l; i++) {
		intervals.push(Aural.Music.IntervalList.getInterval(current));
		current+= 100 * this.intervals[i];
	}

	return intervals;
};

/**
 * Get all chords contained in the scale
 * @return {Aural.Music.Chord[]} Array of chords
 */
Aural.Music.Scale.prototype.getChords = function(octave) {
	octave = octave || 0;
	var chords = Aural.Music.ChordList.chords;
	var matchingChords = [];

	for(var ic = 0, lc = chords.length; ic < lc; ic++) {
		for(var note = 0; note < 12; note++) {
			var chord = chords[ic].copy(Aural.Music.Note.getLabelFromMidi(note + octave * 12).join(''));
			if(this.containsChord(chord)) {
				matchingChords.push(chord);
			}
		}
	}

	return matchingChords;
};

/**
 * Check whether a given chord is contained within the scale
 * @param {Aural.Music.Chord} chord - Chord
 * @return {boolean} 
 */
Aural.Music.Scale.prototype.containsChord = function(chord) {
	var contained = true;
	
	var chordNotes = chord.getNotesAsLabels();
	var scaleNotes = this.getNotesAsLabels();

	for(var i = 0, l = chordNotes.length; i < l; i++) {
		if(scaleNotes.indexOf(chordNotes[i]) === -1) {
			contained = false;
			break;
		}
	}

	return contained;
};

/**
 * Define the key of the scale
 * @param {string} key - Key
 */
Aural.Music.Scale.prototype.setKey = function(key) {
	var label = Aural.Music.Note.parseLabel(key);
	this.key = label[0];
};

/**
 * Transpose the scale
 * @param {Number} intervals - Number of intervals
 */
Aural.Music.Scale.prototype.transpose = function(intervals) {
	var offset = this.getKeyOffset() + intervals;
	var label = Aural.Music.Note.getLabelFromMidi(offset);
	this.key = label[0];
};

/**
 * Return the offset of the key from C
 * @returns {Number} Offset
 */
Aural.Music.Scale.prototype.getKeyOffset = function() {
	return Aural.Music.Note.getMidiFromLabel(this.key) % 12;
};

/**
 * Create a copy of this scale in another key
 * @param {string} key - Desired key (ie: C, D#, ...)
 * @returns {Aural.Music.Scale} Keyed scale
 */
Aural.Music.Scale.prototype.copy = function(key) {
	return new Aural.Music.Scale(this.titles, this.intervals, key);
};