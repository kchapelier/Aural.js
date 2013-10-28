"use strict";

Aural.Music.Tuning = {
	middleA : 440,
	defaultMiddleA : 440,
	/**
	 * Set the frequency of the middle A (A4)
	 * @param {float} frequency - Frequency
	 */
	setMiddleA : function(frequency) {
		frequency = frequency || this.defaultMiddleA;
		this.middleA = frequency;
	}
};