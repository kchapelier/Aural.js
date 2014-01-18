"use strict";

Aural.Sound.Wavelet.Wavelet = function(buffer) {
	this.polarity = (buffer[0] > 0 || buffer[buffer.length - 1] > 0 ) ? 1 : - 1;
	
	this.length = buffer.length;
	this.buffer = buffer;
	this.maxValue = -1;
	
	for(var l = this.buffer.length; l--;) {
		this.maxValue = Math.max(Math.abs(this.buffer[l]), this.maxValue);
	}
};

Aural.Sound.Wavelet.Wavelet.prototype.buffer = null;
Aural.Sound.Wavelet.Wavelet.prototype.length = null;
Aural.Sound.Wavelet.Wavelet.prototype.polarity = null;
Aural.Sound.Wavelet.Wavelet.prototype.maxValue = null;

/**
 * Get a specific sample
 * @param {Number} pos - Position in the sample
 * @param {boolean} normalize - Whether to normalize the samples based on the max value of the wavelet
 * @param {Number} desiredPolarity - Desired polarity (1 or -1)
 * @return {Number} Sound sample
 */
Aural.Sound.Wavelet.Wavelet.prototype.getSample = function(pos, normalize, desiredPolarity) {
	var result = Aural.Sound.Interpolation.process(pos, this.buffer);
	
	result = (normalize ? result / this.maxValue : result);

	if(desiredPolarity === 1 || desiredPolarity === -1) {
		result = result * desiredPolarity * this.polarity;
	}

	return result;
};

Aural.Sound.Wavelet.Collection = function(wavelets) {
	this.setWavelets(wavelets);
	this.currentPolarity = -1;
	this.currentWavelet = -1;
};

Aural.Sound.Wavelet.Collection.prototype.wavelets = null;
Aural.Sound.Wavelet.Collection.prototype.length = null;
Aural.Sound.Wavelet.Collection.prototype.currentPolarity = null;
Aural.Sound.Wavelet.Collection.prototype.currentWavelet = null;

/**
 * Set the wavelet collection
 * @param {Aural.Sound.Wavelet.Wavelet[]|ArrayBuffer} wavelets - Array of wavelets or buffer of samples to process
 */
Aural.Sound.Wavelet.Collection.prototype.setWavelets = function(wavelets) {
	if(wavelets.length > 0) {
		if(typeof wavelets[0] !== 'object') {
			wavelets = this.processAudio(wavelets);
		}
	} else {
		wavelets = [];
	}

	this.wavelets = wavelets;
	this.length = this.wavelets.length;
};

/**
 * Process a buffer into an array of wavelets
 * @param {Array|ArrayBuffer} buffer - Sound buffer
 * @param {Number} [maxWavelets] - Maximum number of wavelets to return
 * @return {Aural.Sound.Wavelet.Wavelet[]} Array of wavelets
 */
Aural.Sound.Wavelet.Collection.prototype.processAudio = function(buffer, maxWavelets) {
	var wavelets = [];
	
	var current = buffer[0];
	var startPos = 0;
	var subBuffer = null;
	
	for(var i = 1; i < buffer.length; i++) {
		if((current > 0 && buffer[i] <= 0) || (current <= 0 && buffer[i] >= 0)) {
			current = buffer[i];
			
			subBuffer = null;
			
			if(buffer.subarray) {
				subBuffer = buffer.subarray(startPos, i);
			} else {
				subBuffer = buffer.slice(startPos, i);
			}
			
			wavelets.push(new Aural.Sound.Wavelet.Wavelet(subBuffer));

			if(maxWavelets > 0 && maxWavelets <= wavelets.length) {
				break;
			}
			
			startPos = i;
		}
	}
	
	return wavelets;
};

/**
 * Get the wavelet at the given index
 * @param {Number} index - Index of the wavelet
 * @return {Aural.Sound.Wavelet.Wavelet} Wavelet
 */
Aural.Sound.Wavelet.Collection.prototype.get = function(index) {
	var position = index % this.wavelets.length;
	var wavelet = this.wavelets[position];

	return wavelet;
};

/**
 * Get the next wavelet
 * @return {Aural.Sound.Wavelet.Wavelet} Wavelet
 */
Aural.Sound.Wavelet.Collection.prototype.next = function() {
	var position = (this.currentWavelet + 1) % this.wavelets.length;
	var wavelet = this.wavelets[position];

	this.currentWavelet = position;

	return wavelet;
};

/**
 * Get a random wavelet
 * @return {Aural.Sound.Wavelet.Wavelet} Wavelet
 */
Aural.Sound.Wavelet.Collection.prototype.random = function() {
	var desiredPolarity = this.currentPolarity * -1;
	var found = false;
	var position = null;
	var wavelet = null;
	
	while(!found) {
		position = Math.floor(Math.random() * this.wavelets.length);
		
		if(position !== this.currentWavelet) {
			wavelet = this.wavelets[position];
			
			if(wavelet.polarity === desiredPolarity) {
				found = true;
			}
		}
	}
	
	this.currentPolarity = wavelet.polarity;
	this.currentWavelet = position;
};