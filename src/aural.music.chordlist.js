"use strict";

Aural.Music.ChordList = {
	chords : [],
	addChord : function(intervals, shortname, name) {
		this.chords.push(new Aural.Music.Chord(intervals, shortname, name));
	},
	fits : function(notes) {
		throw "to implement";
	},
	getChord : function(name) {
		throw "to implement";
	},
	getContainedChord : function(chord) {
		throw "to implement";
	}
};