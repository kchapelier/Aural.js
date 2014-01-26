"use strict";

Aural.Sound.Buffer = function(buffer, sampleRate) {
	this.channels = [];

	if(typeof buffer === 'function') {
		buffer = buffer();
	}

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
	} else {
		this.channels[0] = new Float32Array(0);
	}

	this.sampleRate = sampleRate || 48000;
	this.length = this.channels[0].length;
	this.duration = this.length / this.sampleRate;
	this.numberOfChannels = this.channels.length;
};

Aural.Sound.Buffer.prototype.channels = null;
Aural.Sound.Buffer.prototype.sampleRate = null;
Aural.Sound.Buffer.prototype.duration = null;
Aural.Sound.Buffer.prototype.numberOfChannels = null;

/**
 * Get one sample of a channel
 * @param {Number} sample - Position in the buffer
 * @param {Number} channel - Number of the channel
 * @returns {Number} Sample
 */
Aural.Sound.Buffer.prototype.getSample = function(sample, channel) {
	channel = channel || 0;
	return !!this.channels[channel] ? Aural.Sound.Interpolation.process(sample, this.channels[channel]) : 0;
};

/**
 * Get all the samples for a channel
 * @param {Number} channel - Number of the channel
 * @returns {Number[]} Array of samples (Float32Array)
 */
Aural.Sound.Buffer.prototype.getChannelData = function(channel) {
	return !!this.channels[channel] ? this.channels[channel] : new Float32Array(0);
};

/**
 * Return a wavelet collection for a channel
 * @param {Number} channel - Number of the channel
 * @returns {Aural.Sound.Wavelet.Collection} Wavelet collection
 */
Aural.Sound.Buffer.prototype.getWavelets = function(channel) {
	return !!this.channels[channel] ? new Aural.Sound.Wavelet.Collection(this.channels[channel]) : null;
};

/**
 * Make the buffer mono (force it to a single channel, removing channels where necessary)
 * @param {boolean} merge - Whether to sum all the channels
 */
Aural.Sound.Buffer.prototype.makeMono = function(merge) {
	if(merge) {
		var count = this.channels.length;
		var monoChannel = [];
		
		if(count > 0) {
			var i, i2, l, channel;
			for(i = 0; i < count; i++) {
				channel = this.getChannelData(i);
				for(i2 = 0, l = channel.length; i2 < l; i2++) {
					if(monoChannel.length > i2) {
						monoChannel[i2]+=channel[i2];
					} else {
						monoChannel.push(channel[i2]);
					}
				}
			}
			
			for(i = 0, l = monoChannel.length; i < l; i++) {
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

/**
 * Make the buffer stereo (force it to two channels, copying and removing channels where necessary)
 */
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