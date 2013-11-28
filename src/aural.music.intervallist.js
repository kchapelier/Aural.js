"use strict";

Aural.Music.IntervalList = {
	intervals : {},
	/**
	 * Add an interval to the list
	 * @param {integer} cents - Cents difference
	 * @param {string[]} titles - Array of possible titles
	 */
	addInterval : function(cents, titles) {
		if(!!this.intervals[cents]) {
			this.intervals[cents].addTitles(titles);
		} else {
			this.intervals[cents] = new Aural.Music.Interval(titles, cents);
		}
	},
	/**
	 * Return the interval matching the difference in cents between two given notes
	 * @param {Aural.Music.Note} note1 - First note
	 * @param {Aural.Music.Note} note2 - Second note
	 * @return {Aural.Music.Interval} Interval
	 */
	match : function(note1, note2) {
		var deltaCents = (note1.cents - note2.cents) + (note1.midi - note2.midi) * 100;
		var identifier = this.getIdentifier(deltaCents);

		return !!this.intervals[identifier] ? this.intervals[identifier] : null;
	},
	/**
	 * Return the interval  matching a given name or cent amount
	 * @param {string|float} identifier - Name or cent
	 * @return {Aural.Music.Interval} Interval
	 */
	getInterval : function(identifier) {
		var interval = null;

		switch(typeof identifier) {
			case 'float':
			case 'integer':
			case 'number':
				identifier = this.getIdentifier(identifier);
				interval = !!this.intervals[identifier] ? this.intervals[identifier] : null;
				break;
			case 'string':
				for(var key in this.intervals) {
					if(this.intervals[key].titles.indexOf(identifier) >= 0) {
						interval = this.intervals[key];
						break;
					}
				}
				break;
		}

		return interval;
	},
	/**
	 * Return an identifier to use with/against the list from a number of cents
	 * @param {float} cents
	 * @return {string} Identifier
	 */
	getIdentifier : function(cents) {
		return (Math.floor(Math.abs(cents) * 1000) / 1000).toString(10);
	}	
};