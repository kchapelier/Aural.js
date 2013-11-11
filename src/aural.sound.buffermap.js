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

Aural.Sound.BufferMap.prototype.processVolumeMap = function() {
	var previous = 0;
	var previousPeak = 0;
	var sample = 0;
	var nextSample = 0;
	
	var vgate = this.volumeMapGate;
	var vsmoothing = this.volumeMapSmoothing;
	var vlimiting = this.volumeMapLimiting;
	
	var peaks = {
		'0' : 0
	};
	
	var wavelets = new Aural.Sound.Wavelet.Collection(this.buffer);
	var pos = 0;
	var wavelet;
	var min = 0;
	var max = 0;
	var advance = 0;
	var duration = 0;
	var maxOffset = 0;
	for(var i = 0, l = wavelets.length; i < l; i++) {
		wavelet = wavelets.wavelets[i];

		sample = Math.pow(wavelet.maxValue * 10, 2);

		min = sample;
		max = sample;
		maxOffset = 0;
		advance = 0;
		duration = 0;

		nextSample = Math.abs(i + 1 < l ? wavelets.get(i + 1).maxValue : 0);

		if(sample < vgate) {
			sample = 0;
		}

		if(sample > previous && sample > nextSample) {
			if(Math.abs(sample - previousPeak) > vsmoothing) {
				while(sample >= max || advance < vlimiting) {
					i++;
					advance++;
					
					var nextSample = Math.pow(wavelets.wavelets[i].maxValue * 10, 2);

					if(max < nextSample) {
						if(nextSample - max > (vsmoothing * Math.sqrt(vlimiting))) {
							i--;
							break;
						}

						max = nextSample;
						advance = 0;
						maxOffset = duration;
					}

					if(min > nextSample) {
						min = nextSample;
					}

					sample = nextSample;
					duration+= wavelets.wavelets[i].length;
				}


				peaks[pos + maxOffset] = Math.sqrt(max) / 10;
				previousPeak = max;
			}
		}

		previous = sample;
		pos+= wavelet.length + duration;

	}

	peaks[this.buffer.length - 1] = 0;
	
	this.volumeMap = peaks;
};

Aural.Sound.BufferMap.prototype.getVolumeMap = function() {
	if(this.volumeMap === null) {
		this.processVolumeMap();
	}
	
	return this.volumeMap;
};