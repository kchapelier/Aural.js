"use strict";

//TODO: Use interpolation when available
//TODO: Actually test with an arraybuffer

Aural.Sound.Wavelet = function(buffer) {
	this.polarity = (buffer[0] > 0 || buffer[buffer.length - 1] > 0 ) ? 1 : - 1;
	
	this.length = buffer.length;
	this.buffer = buffer;
	this.maxValue = -1;
	
	for(var l = this.buffer.length; l--;) {
		this.maxValue = Math.max(Math.abs(this.buffer[l]), this.maxValue);
	}
};

Aural.Sound.Wavelet.prototype.buffer = null;
Aural.Sound.Wavelet.prototype.length = null;
Aural.Sound.Wavelet.prototype.polarity = null;
Aural.Sound.Wavelet.prototype.maxValue = null;

/**
 * Get a specific sample
 * @param {float} pos - Position in the sample
 * @param {boolean} normalize - Whether to normalize the samples based on the max value of the wavelet
 * @return {float} Sound sample
 */
Aural.Sound.Wavelet.prototype.getSample = function(pos, normalize) {
	var result = this.buffer[pos % this.buffer.length];
	
	return (normalize ? result / this.maxValue : result);
};

/**
 * Process a buffer into an array of wavelets
 * @param {array|ArrayBuffer} buffer - Sound buffer
 * @param {[type]} maxWavelets - Maximum number of wavelets to return
 * @return {Aural.Sound.Wavelet[]} Array of wavelets
 */
Aural.Sound.Wavelet.process = function(buffer, maxWavelets) {
	var wavelets = [];
	
	var current = buffer[0];
	var startPos = 0;
	
	for(var i = 1; i < buffer.length; i++) {
		if((current > 0 && buffer[i] <= 0) || (current <= 0 && buffer[i] >= 0)) {
			current = buffer[i];
			
			var subBuffer = buffer.slice(startPos, i - 1);
			
			if(subBuffer.length > 4) {
				wavelets.push(new Aural.Sound.Wavelet(subBuffer));

				if(maxWavelets > 0 && maxWavelets <= wavelets.length) {
					break;
				}
			}
			
			startPos = i;
		}
	}
	
	return wavelets;
};