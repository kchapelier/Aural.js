"use strict";

//TODO : implements getContainedChords

Aural.Music.ChordList = {
	chords : [],
	shortnameTranslations : {},
	/**
	 * Add a chord to the list
	 * @param {Number[]} intervals - Successive intervals of the chord
	 * @param {string[]} shortnames - Array of possible shortnames
	 * @param {string} name - Name of the chord
	 */
	addChord : function(intervals, shortnames, name) {
		this.chords.push(new Aural.Music.Chord(intervals, shortnames, name));
	},
	/**
	 * Normalize a set of notes to intervals
	 * @param {string[]|Number[]|Aural.Music.Note[]} input - Notes
	 * @returns {Object} Array of intervals
	 * @private
	 */
	normalizeInput : function(input) {
		var i, l;

		for(i = 0, l = input.length; i < l; i++) {
			var type = typeof input[i];
			
			switch(type) {
				case 'string':
					var midi = Aural.Music.Note.getMidiFromLabel(input[i]);
					input[i] = midi;
					break;
				case 'object': //object of type Note
					input[i] = input[i].midi;
					break;
			}
		}
		
		input.sort(function(a, b) { return a - b; });
		
		var intervals = {
			offset : input[0],
			intervals : null
		};

		for(l = input.length; l--;) {
			input[l]-= input[Math.max(0, l - 1)];
		}
		
		intervals.intervals = input;

		return intervals;
	},
	/**
	 * Compares an array of successive intervals to a chord and return the eventual matching keyed copy
	 * @param {Object} intervals - Array of successive intervals
	 * @param {Aural.Music.Chord} chord - Chord
	 * @returns {Aural.Music.Chord} Matching keyed Chord
	 * @private
	 */
	compareIntervals : function (intervals, chord) {
		if(intervals.intervals.length === chord.intervals.length) {
			var correct = true;

			for(var i = 0, l = intervals.intervals.length; i < l; i++) {
				if(intervals.intervals[i] !== chord.intervals[i]) {
					correct = false;
					break;
				}
			}

			if(correct) {
				var label = Aural.Music.Note.getLabelFromMidi(intervals.offset);
				return chord.copy(label[0], label[1]);
			}
		}

		return null;
	},
	/**
	 * Get all the chords matching a given set of notes
	 * @param {string[]|Number[]|Aural.Music.Note[]} notes - Notes
	 * @returns {Aural.Music.Chord[]} Array of matching chords
	 */
	fits : function(notes) {
		var intervals = this.normalizeInput(notes);

		var correctChords = [];
		
		for(var l = this.chords.length; l--;) {
			var chord = this.compareIntervals(intervals, this.chords[l]);
			
			if(chord) {
				correctChords.push(chord);
			}
		}
		
		return correctChords;
	},
	/**
	 * Get a specific chord
	 * @param {string} name - Name of the chord
	 * @param {string} key - Name of the key (ie: C or G#)
	 * @param {Number} octave - Octave
	 * @returns {Aural.Music.Chord} Specified chord
	 */
	getChord : function(name, key, octave) {
		var parsed = this.parseName(name);

		if(parsed) {
			key = key || parsed[0];
			octave = octave || parsed[1];
			name = parsed[2];
		}

		var shortname = name;

		for(var from in this.shortnameTranslations) {
			if(this.shortnameTranslations.hasOwnProperty(from)) {
				shortname = shortname.replace(from, this.shortnameTranslations[from]);
			}
		}

		for(var i = 0, l = this.chords.length; i < l; i++) {
			if(this.chords[i].name === name || this.chords[i].shortnames.indexOf(shortname) > -1) {
				return this.chords[i].copy(key, octave);
			}
		}

		return null;
	},
	addDirectShortnameTranslation : function(from, to) {
		this.shortnameTranslations[from] = to;
	},
	/**
	 * Parse given name and extract useful informations
	 * @param name Name of a chord
	 * @returns {Array}
	 * @private
	 */
	parseName : function(name) {
		var regex = /^([CDEFGAB][#b]?-?[0-9]*) *(.*)/;
		var result = regex.exec(name);
		var octave = null;
		var label = null;

		if(result) {
			label = result[1];
			name = result[2];
			label = Aural.Music.Note.parseLabel(label);
			octave = label[1];
			label = label[0];
		}

		return [label, octave, name];
	},
	/**
	 * Get all the chords contained within a given chord
	 * @param {Aural.Music.Chord} chord - Chord to ocmpare with
	 * @returns {Aural.Music.Chord[]} Array of contained chord
	 */
	getContainedChord : function(chord) {
		throw "to implement";
	}
};