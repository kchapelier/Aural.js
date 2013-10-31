"use strict";

//TODO: Decide whether to implement loading directly an arraybuffer

Aural.Sound.WaveletPlayer = function(wavelets) {
	this.setWavelets(wavelets);
	this.currentPolarity = -1;
	this.currentWavelet = -1;
};

/**
 * Set the wavelet collection
 * @param {Aural.Sound.Wavelet} wavelets - Array of wavelets
 */
Aural.Sound.WaveletPlayer.prototype.setWavelets = function(wavelets) {
	this.wavelets = wavelets;
};

Aural.Sound.WaveletPlayer.prototype.wavelets = null;
Aural.Sound.WaveletPlayer.prototype.currentPolarity = null;
Aural.Sound.WaveletPlayer.prototype.currentWavelet = null;

Aural.Sound.WaveletPlayer.prototype.next = function() {
	var desiredPolarity = this.currentPolarity * -1;
	var found = false;
	var position = null;
	var wavelet = null;
	
	while(!found) {
		position = Math.floor(Math.random() * this.wavelets.length);
		
		if(position != this.currentWavelet) {
			wavelet = this.wavelets[position];
			
			if(wavelet.polarity == desiredPolarity) {
				found = true;
			}
		}
	}
	
	this.currentPolarity = wavelet.polarity;
	this.currentWavelet = position;
};