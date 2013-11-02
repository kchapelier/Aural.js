"use strict";

Aural.Music.Interval = function(titles, cents) {
	this.titles = titles;
	this.cents = cents;
};

Aural.Music.Interval.prototype.titles = null;
Aural.Music.Interval.prototype.cents = null;

/**
 * Add titles to the interval
 * @param {string} titles - Array of titles to add
 */
Aural.Music.Interval.prototype.addTitles = function(titles) {
	for(var i = 0, l = titles.length; i < l; i++) {
		this.titles.push(titles[i]);
	}
};

/**
 * Get the note at the specified number of intervals from a given note
 * @param {Aural.Music.Note} note - Note
 * @param {integer} multiplier - Multiplier
 * @return {Aural.Music.Note} Resulting note
 */
Aural.Music.Interval.prototype.getNoteAtInterval = function(note, multiplier) {
	var newNote = note.copy();
	newNote.applyInterval(this, multiplier);

	return newNote;
};