"use strict";

Aural.Utils.Support = {};

Aural.Utils.Support.audioContextClass = null;
Aural.Utils.Support.audioContextCollection = {};

if(!!window['AudioContext']) {
	Aural.Utils.Support.audioContextClass = window.AudioContext;
} else if(!!window['webkitAudioContext']) {
	Aural.Utils.Support.audioContextClass = window.webkitAudioContext;
} else if(!!window['mozAudioContext']) {
	Aural.Utils.Support.audioContextClass = window.mozAudioContext;
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
 * @param {string} identifier - Identifier (default : global)
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
}