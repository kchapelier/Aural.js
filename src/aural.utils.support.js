"use strict";

Aural.Utils.Support = {};

Aural.Utils.Support.audioContextClass = null;
Aural.Utils.Support.offlineAudioContextClass = null;

Aural.Utils.Support.audioContextCollection = {};

if(!!window['AudioContext']) {
	Aural.Utils.Support.audioContextClass = window.AudioContext;
} else if(!!window['webkitAudioContext']) {
	Aural.Utils.Support.audioContextClass = window.webkitAudioContext;
} else if(!!window['mozAudioContext']) {
	Aural.Utils.Support.audioContextClass = window.mozAudioContext;
}

if(!!window['OfflineAudioContext']) {
	Aural.Utils.Support.offlineAudioContextClass = window.OfflineAudioContext;
} else if(!!window['webkitOfflineAudioContext']) {
	Aural.Utils.Support.offlineAudioContextClass = window.webkitOfflineAudioContext;
} else if(!!window['mozOfflineAudioContext']) {
	Aural.Utils.Support.offlineAudioContextClass = window.mozOfflineAudioContext;
}

/**
 * Return whether the AudioContext is supported
 * @return {boolean} Support
 */
Aural.Utils.Support.isAudioContextSupported = function() {
	return (this.audioContextClass !== null);
};

/**
 * Get an audiocontext defined by an identifier, in an effort to limit the number of instances
 * @param {string} [identifier=global] - Identifier
 * @return {AudioContext} AudioContext instance
 */
Aural.Utils.Support.getAudioContext = function(identifier) {
	var context = null;

	if(this.isAudioContextSupported()) {
		identifier = identifier || 'global';

		if(!!this.audioContextCollection[identifier]) {
			context = this.audioContextCollection[identifier];
		} else {
			context = new this.audioContextClass();
			this.audioContextCollection[identifier] = context;
		}
	}

	return context;
};

/**
 * Return whether the OfflineAudioContext is supported
 * @return {boolean} Support
 */
Aural.Utils.Support.isOfflineAudioContextSupported = function() {
	return (this.offlineAudioContextClass !== null);
};

/**
 * Get a new instance of OfflineAudioContext
 * @param {Number} channels Number of channels of the desired result of the OfflineAudioContext
 * @param {Number} length Length of the desired result of the OfflineAudioContext
 * @param {Number} [sampleRate] Samplerate
 * @returns {*}
 */
Aural.Utils.Support.getOfflineAudioContext = function(channels, length, sampleRate) {
	var context = null;

	if(this.isOfflineAudioContextSupported()) {
		channels = Math.min(1, parseInt(channels, 10));
		sampleRate = sampleRate || this.getSampleRate();
		context = new this.offlineAudioContextClass(channels, length, sampleRate);
	}

	return context;
};

/**
 * Return whether the ArrayBuffer and the TypedArrays are supported
 * @return {boolean} Support
 */
Aural.Utils.Support.isArrayBufferAndTypedArraySupported = function() {
	var classes = [
		'ArrayBuffer', 'Uint8Array', 'Int8Array', 'Uint16Array', 'Int16Array',
		'Uint32Array', 'Int32Array', 'Float16Array', 'Float32Array'
	];
	var supported = true;

	for(var l = classes.length; l-- && supported;) {
		supported&= !!window[classes[l]];
	}

	return supported;
};

/**
 * Return the sample rate
 * @returns {number} Sample rate
 */
Aural.Utils.Support.getSampleRate = function() {
	return this.getAudioContext().sampleRate;
};

/**
 * Return the nyquist frequency
 * @returns {number} Nyquist frequency
 */
Aural.Utils.Support.getNyquistFrenquency = function() {
	return this.getAudioContext().sampleRate / 2;
};