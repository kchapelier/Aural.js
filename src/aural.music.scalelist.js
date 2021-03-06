"use strict";

//TODO : implements getContainedScales

Aural.Music.ScaleList = {
	scales : [],
	/**
	 * Add a scale to the list
	 * @param {Number[]} intervals - Successive intervals of the scale
	 * @param {string[]} titles - Array of possible titles
	 */
	addScale : function(intervals, titles) {
		this.scales.push(new Aural.Music.Scale(titles, intervals));
	},
	/**
	 * Compares an array of successive intervals to a scale and return every matching keyed copy
	 * @param {Object} intervals - Array of successive intervals
	 * @param {Aural.Music.Scale} scale - Scale
	 * @returns {Aural.Music.Scale[]} Matching keyed scales
	 * @private
	 */
	compareIntervals : function(intervals, scale) {
		var input = intervals.intervals;
		var expected = scale.intervals;
		var correctScales = [];
		var x, i, l, nl;

		for(x = 0, l = expected.length; x < l; x++) {
			var mExpected = expected.slice(0);
			var offset = 0;
			
			for(i = 0; i < x; i++) {
				offset+= mExpected[0];
				mExpected.push(mExpected.shift());
			}
			
			var expectPos = 0;
			var correct = false;

			for(i = 0, nl = input.length; i < nl; i++) {
				var val = input[i];
				var expectVal = 0;
				correct = false;

				while(true) {
					expectVal+= mExpected[expectPos];
					
					expectPos++;
					
					if(expectVal === val) {
						correct = true;
						break;
					} else if(expectPos >= mExpected.length || expectVal > val) {
						break;
					}
				}
				
				if(!correct) {
					break;
				}
			}
			
			if(correct) {
				var label = Aural.Music.Note.getLabelFromMidi(intervals.offset - offset + 12);
				correctScales.push(scale.copy(label[0]));
			}
		}
		
		return correctScales;
	},
	/**
	 * Normalize a set of notes to successive intervals
	 * @param {string[]|Number[]|Aural.Music.Note[]} input - Notes
	 * @returns {Object} Array of successive intervals
	 * @private
	 */
	normalizeInput : function(input) {
		var i, l;

		for(i = 0, l = input.length; i < l; i++) {
			var type = typeof input[i];
			
			switch(type) {
				case 'string':
					var midi = Aural.Music.Note.getMidiFromLabel(input[i]);
					input[i] = (midi % 12);
					break;
				case 'object': //object of type Note
					input[i] = (input[i].midi % 12);
					break;
			}
		}
		
		input.sort(function(a, b) { return a - b; });
		
		var intervals = {
			offset : input[0],
			intervals : null
		};
		
		var mInput = input.slice(0);
		mInput.push(mInput[0] + 12);
		
		for(l = mInput.length; l--;) {
			mInput[l]-= mInput[l - 1];
		}
		
		mInput.shift();
		
		intervals.intervals = mInput;
		
		return intervals;
	},
	/**
	 * Get all scales matching a given set of notes
	 * @param {string[]|Number[]|Aural.Music.Note[]} notes - Notes
	 * @param {boolean} exactOnly - Whether to return only the scales matching exactly without any additionnal notes
	 * @returns {Aural.Music.Scale[]} Array of matching scales
	 */
	fits : function(notes, exactOnly) {
		var intervals = this.normalizeInput(notes);
		
		var correctScales = [];
		
		for(var l = this.scales.length; l--;) {
			var scales = this.compareIntervals(intervals, this.scales[l]);
			
			for(var i = scales.length; i--;) {
				if(exactOnly && scales[i].intervals.length !== intervals.intervals.length) {
					continue;
				}
				
				correctScales.push(scales[i]);
			}
		}
		
		return correctScales;
	},
	/**
	 * Get a specific scale
	 * @param {string} name - Name of the scale (ie: aeolian, minor or whole-tone)
	 * @param {string} key - Name of the key (ie: C or G#)
	 * @returns {Aural.Music.Scale|null} Specified scale
	 */
	getScale : function(name, key) {
		for(var i = 0, l = this.scales.length; i < l; i++) {
			for(var k = 0, l2 = this.scales[i].titles.length; k < l2; k++) {
				if(this.scales[i].titles[k] === name) {
					return this.scales[i].copy(key);
				}
			}
		}
		
		return null;
	},
	/**
	 * Get all scales containing all the notes as the specified scale
	 * @param {Aural.Music.Scale} scale - Scale to compare with
	 * @param {boolean} exactOnly - Specify if only the scales containing exactly the same notes are considered valid
	 * @returns {Aural.Music.Scale[]} Array of similar scales
	 */
	getSimilarScales : function(scale, exactOnly) {
		return this.fits(scale.getNotesAsLabels(), exactOnly);
	},
	/**
	 * Get all the scales matching a part of the notes of the specified scale
	 * @param {Aural.Music.Scale} scale - Scale to compare with
	 * @returns {Aural.Music.Scale[]} Array of contained scales
	 */
	getContainedScales: function(scale) {
		throw "to implements";
	}
};