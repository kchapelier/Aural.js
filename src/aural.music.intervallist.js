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
		var deltaCents = Math.abs((note1.cents - note2.cents) + (note1.midi - note2.midi) * 100);

		return !!this.intervals[deltaCents] ? this.intervals[deltaCents] : null;
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
				identifier = Math.abs(identifier);
				interval = !!this.intervals[deltaCents] ? this.intervals[deltaCents] : null;
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
	}
};