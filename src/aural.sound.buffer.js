"use strict";

Aural.Sound.Buffer = function(buffer, sampleRate) {
	this.channels = [];

	var type = {}.toString.call(buffer);

	if(type === '[object AudioBuffer]') {
		var nbChannels = buffer.numberOfChannels;
		sampleRate = buffer.sampleRate;
		for(var i = 0; i < nbChannels; i++) {
			this.channels[i] = buffer.getChannelData(i);
		}
	} else if(type === '[object ArrayBuffer]') {
		this.channels[0] = buffer;
	} else if(type === '[object Array]') {
		this.channels[0] = new Float32Array(buffer);
	}

	this.sampleRate = sampleRate || 48000;
	this.length = buffer.length;
	this.duration = this.length / this.sampleRate;
	this.numberOfChannels = this.channels.length;
};

Aural.Sound.Buffer.prototype.channels = null;
Aural.Sound.Buffer.prototype.sampleRate = null;
Aural.Sound.Buffer.prototype.duration = null;
Aural.Sound.Buffer.prototype.numberOfChannels = null;

Aural.Sound.Buffer.prototype.getSample = function(sample, channel) {
	return !!this.channels[channel] ? Aural.Sound.Interpolation.process(sample, this.channels[channel]) : 0;
};

Aural.Sound.Buffer.prototype.getChannelData = function(channel) {
	return !!this.channels[channel] ? this.channels[channel] : new Float32Array(0);
};

Aural.Sound.Buffer.prototype.getWavelets = function(channel) {
	return !!this.channels[channel] ? new Aural.Sound.Wavelet.Collection(this.channels[channel]) : null;
};

Aural.Sound.Buffer.prototype.makeMono = function(merge) {
	if(merge) {
		var count = this.channels.length;
		var monoChannel = [];
		
		if(count > 0) {
			for(var i = 0; i < count; i++) {
				var channel = this.getChannelData(i);
				for(var i2 = 0, l = channel.length; i2 < l; i2++) {
					if(monoChannel.length > i2) {
						monoChannel[i2]+=channel[i2];
					} else {
						monoChannel.push(channel[i2]);
					}
				}
			}
			
			for(var i = 0, l = monoChannel.length; i < l; i++) {
				monoChannel[i] /= count;
			}
		}
		
		this.channels = [monoChannel];
	} else {
		for(;this.channels.length > 1;) {
			this.channels.pop();
		}
	}

	this.numberOfChannels = this.channels.length;
};

Aural.Sound.Buffer.prototype.makeStereo = function() {
	if(this.channels.length === 1) {
		this.channels.push(this.getChannelData(0));
	} else if(this.channels.length > 2) {
		for(;this.channels.length > 2;) {
			this.channels.pop();
		}
	}

	this.numberOfChannels = this.channels.length;
};