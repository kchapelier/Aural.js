"use strict";

Aural.Music.ChordList = {
	chords : [],
	shortnameTranslations : {},
	addChord : function(intervals, shortnames, name) {
		this.chords.push(new Aural.Music.Chord(intervals, shortnames, name));
	},
	/**
	 * Normalize a set of notes to intervals
	 * @param {string[]|integer[]|Aural.Music.Note[]} input - Notes
	 * @returns {integer[]} Array of intervals
	 */
	normalizeInput : function(input) {
		for(var i = 0, l = input.length; i < l; i++) {
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

		for(var l = input.length; l--;) {
			input[l]-= input[Math.max(0, l - 1)];
		}
		
		intervals.intervals = input;

		return intervals;
	},
	compareIntervals : function (intervals, chord) {
		if(intervals.intervals.length == chord.intervals.length) {
			var correct = true;

			for(var i = 0, l = intervals.intervals.length; i < l; i++) {
				if(intervals.intervals[i] != chord.intervals[i]) {
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
	getChord : function(name, key, octave) {
		var parsed = this.parseName(name);

		if(parsed) {
			key = key || parsed[0];
			octave = octave || parsed[1];
			name = parsed[2];
		}

		var shortname = name;

		for(var from in this.shortnameTranslations) {
			shortname = shortname.replace(from, this.shortnameTranslations[from]);
		}

		for(var i = 0, l = this.chords.length; i < l; i++) {
			if(this.chords[i].name == name || this.chords[i].shortnames.indexOf(shortname) > -1) {
				return this.chords[i].copy(key, octave);
			}
		}

		return null;
	},
	addDirectShortnameTranslation : function(from, to) {
		this.shortnameTranslations[from] = to;
	},
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
	getContainedChord : function(chord) {
		throw "to implement";
	}
};