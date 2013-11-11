"use strict";

Aural.Sound.BufferMap = function(buffer, vgate, vsmoothing, vlimiting, tgate, tlimiting) {
	this.buffer = buffer;
	
	this.transientMap = null;
	this.volumeMap = null;
	
	this.setVolumeMapGate(vgate);
	this.setVolumeMapSmoothing(vsmoothing);
	this.setVolumeMapLimiting(vlimiting);
	this.setTransientMapGate(tgate);
	this.setTransientMapLimiting(tlimiting);
};

Aural.Sound.BufferMap.prototype.buffer = null;

Aural.Sound.BufferMap.prototype.volumeMap = null;
Aural.Sound.BufferMap.prototype.transientMap = null;

Aural.Sound.BufferMap.prototype.volumeMapLimiting = null;
Aural.Sound.BufferMap.prototype.volumeMapGate = null;
Aural.Sound.BufferMap.prototype.volumeMapSmoothing = null;
Aural.Sound.BufferMap.prototype.transientMapGate = null;
Aural.Sound.BufferMap.prototype.transientMapLimiting = null;

Aural.Sound.BufferMap.prototype.forceRefresh = function() {
	this.transientMap = null;
	this.volumeMap = null;
};

Aural.Sound.BufferMap.prototype.setVolumeMapGate = function(vgate) {
	this.volumeMapGate = Math.abs(vgate || 0);
	this.transientMap = null;
	this.volumeMap = null;
};

Aural.Sound.BufferMap.prototype.setVolumeMapSmoothing = function(vsmoothing) {
	this.volumeMapSmoothing = Math.abs(vsmoothing || 0);
	this.transientMap = null;
	this.volumeMap = null;
};

Aural.Sound.BufferMap.prototype.setVolumeMapLimiting = function(vlimiting) {
	this.volumeMapLimiting = Math.max(1, vlimiting || 1);
	this.transientMap = null;
	this.volumeMap = null;
};

Aural.Sound.BufferMap.prototype.setTransientMapGate = function(tgate) {
	this.transientMapGate = tgate || 0.3;
	this.transientMap = null;
};

Aural.Sound.BufferMap.prototype.setTransientMapLimiting = function(tlimiting) {
	this.transientMapLimiting = tlimiting || 2;
	this.transientMap = null;
};

Aural.Sound.BufferMap.prototype.processPolarVolumeMap = function(wavelets, polarity) {
	var peaks = {
		'0' : 0
	};

	var vgate = this.volumeMapGate;
	var vsmoothing = this.volumeMapSmoothing;
	var vlimiting = this.volumeMapLimiting;

	var min = 0;
	var max = 0;
	var advance = 0;
	var duration = 0;
	var maxOffset = 0;

	var previous = 0;
	var previousPeak = 0;
	var sample = 0;
	var nextSample = 0;
	var pos = 0;
	var wavelet;

	for(var i = 0, l = wavelets.length; i < l; i++) {
		wavelet = wavelets.wavelets[i];

		if(wavelet.polarity != polarity) {
			pos+= wavelet.length;
			continue;
		}

		sample = wavelet.maxValue;
		sample = sample > vgate ? wavelet.maxValue : 0;

		max = sample;
		maxOffset = 0;
		advance = 0;
		duration = 0;

		while(sample >= max && advance < vlimiting) {
			i++;
			advance++;

			var nextWavelet = !!wavelets.wavelets[i] ? wavelets.wavelets[i] : null;

			if(nextWavelet && nextWavelet.polarity == polarity) {
				var nextSample = nextWavelet.maxValue;

				if(max < nextSample) {
					if(nextSample - max > (Math.sqrt(vlimiting) / 10000)) {
						i--;
						break;
					}

					max = nextSample;
					advance = 0;
					maxOffset = duration;
				}

				sample = nextSample;
			}

			duration+= nextWavelet ? nextWavelet.length : 0;
		}

		peaks[pos + maxOffset] = max;

		pos+= wavelet.length + duration;
	}

	peaks[this.buffer.length - 1] = 0;

	var previousPos = 0;
	var previousPeak = 0;
	var sample = 0;

	var map = new Float32Array(this.buffer.length);

	for(var key in peaks) {
		key*=1;
		sample = peaks[key];

		sample = sample < previousPeak ? sample * (1 - vsmoothing) + previousPeak * vsmoothing : sample;

		map[key] = sample;

		var duration = key - previousPos;

		var start = previousPos;

		for(; previousPos < key; previousPos++) {
			map[previousPos] = Aural.Sound.Interpolation.linear((previousPos - start) / duration, [previousPeak, sample]);
		}

		previousPeak = sample;
		previousPos = key;
	}

	return map;
};

Aural.Sound.BufferMap.prototype.processVolumeMap = function() {
	var vgate = this.volumeMapGate;
	var vsmoothing = this.volumeMapSmoothing;
	var vlimiting = this.volumeMapLimiting;

	var wavelets = new Aural.Sound.Wavelet.Collection(this.buffer);

	var positiveMap = this.processPolarVolumeMap(wavelets, 1);
	var negativeMap = this.processPolarVolumeMap(wavelets, -1);

	//make the smooth envelope
	var volumeMap = new Float32Array(this.buffer.length);

	for(var i = 0, l = volumeMap.length; i < l; i++) {
		volumeMap[i] = Math.max(negativeMap[i], positiveMap[i]);
	}

	this.volumeMap = volumeMap;
};

Aural.Sound.BufferMap.prototype.getVolumeMap = function() {
	if(this.volumeMap === null) {
		this.processVolumeMap();
	}
	
	return this.volumeMap;
};

Aural.Sound.BufferMap.prototype.processTransientsMap = function() {
	var ipos = 0;
	var previous = 0;
	var sample = 0;
	var previous = 0;
	
	var tgate = this.transientMapGate;
	var tlimiting = this.transientMapLimiting;
	
	var transients = {
		0 : [0,0]
	};
	
	for(var i = 0, l = this.volumeMap.length; i < l; i++) {
		sample = Math.abs(this.volumeMap[i]);
		if(sample - previous > tgate) {
			var min = sample;
			var max = sample;
			var advance = 0;
			
			while(sample >= max || advance < tlimiting) {
				i++;
				advance++;
				
				sample = Math.abs(this.volumeMap[i]);
				
				if(max < sample) {
					max = sample;
					advance = 0;
				}
				
				if(min > sample) {
					min = sample;
				}
			}
			
			transients[i] = [min, max];
		}
		previous = sample;
	}
	
	transients[this.buffer.length] = [0,0];
	
	this.transientMap = transients;
};

Aural.Sound.BufferMap.prototype.getTransientsMap = function() {
	if(this.transientMap === null) {
		this.processTransientsMap();
	}
	
	return this.transientMap;
};