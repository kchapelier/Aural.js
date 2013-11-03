"use strict";

//TODO: Externalize the instanciation of the AudioContext

/**
 * XmlHttpRequest helper specialized in handling files and multiple requests at once
 * @type {object}
 */
Aural.Utils.XHR = {
	audioContext : null,
	preferredMode : 'serial',
	/**
	 * Executes multiple requests 
	 * @param {object[]} files - Array of objects with an 'url', an 'id' and a 'type'
	 * @param {function} callbackFile - Callback on complete per request
	 * @param {function} callbackFinal - Callback on complete
	 * @param {function} callbackError - Callback on failure (one failure means the end of the requests)
	 */
	multiLoad : function(files, callbackFile, callbackFinal, callbackError) {
		if(Aural.Utils.XHR.preferredMode == 'serial') {
			this.serialLoad(files, callbackFile, callbackFinal, callbackError);
		} else {
			this.parallelLoad(files, callbackFile, callbackFinal, callbackError);
		}
	},
	/**
	 * Executes successive requests 
	 * @param {object[]} files - Array of objects with an 'url', an 'id' and a 'type'
	 * @param {function} callbackFile - Callback on complete per request
	 * @param {function} callbackFinal - Callback on complete
	 * @param {function} callbackError - Callback on failure (one failure means the end of the requests)
	 */
	serialLoad : function(files, callbackFile, callbackFinal, callbackError) {
		var loading = 0;

		var loaderCallback = function(data) {
			if(callbackFile) {
				callbackFile(data, files[loading].id, files[loading].url);
			}

			loading++;

			if(loading < files.length) {
				loader();
			} else {
				if(callbackFinal) {
					callbackFinal();
				}
			}
		};

		var loader = function() {
			var url = files[loading].url;
			var type = files[loading].type;

			Aural.Utils.XHR.load(url, type, loaderCallback, callbackError);
		};

		loader();
	},
	/**
	 * Executes parallel requests
	 * @param {object[]} files - Array of objects with an 'url', an 'id' and a 'type'
	 * @param {function} callbackFile - Callback on complete per request
	 * @param {function} callbackFinal - Callback on complete
	 * @param {function} callbackError - Callback on failure (one failure means the end of the requests)
	 */
	parallelLoad : function(files, callbackFile, callbackFinal, callbackError) {
		var loaded = 0;
		var error = false;

		var iteration = function(file) {
			Aural.Utils.XHR.load(
				file.url,
				file.type,
				function(data) {
					if(!error) {
						if(callbackFile) {
							callbackFile(data, file.id, file.url)
						}

						loaded++

						if(loaded == files.length && callbackFinal) {
							callbackFinal();
						}
					}
				},
				function(request) {
					error = true;

					if(callbackError) {
						callbackError(request);
					}
				}
			);
		};

		for(var i = 0, l = files.length; i < l; i++) {
			iteration(files[i]);
		}
	},
	/**
	 * Execute one request
	 * @param {string} url - Url
	 * @param {string} type - Type expected (audio for an AudioBuffer, arraybuffer for an ArrayBuffer)
	 * @param {function} callback - Callback on complete
	 * @param {function} callbackError - Callback on failure
	 */
	load : function(url, type, callback, callbackError) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		
		switch(type) {
			case 'audio':
				request.responseType = 'arraybuffer';

				request.onload = function() {
					Aural.Utils.XHR.decodeAudio(request.response, callback, callbackError);
				};

				request.onerror = function() {
					if(callbackError) {
						callbackError(request);
					}
				};

				request.send();
				break;
			case 'arraybuffer':
				request.responseType = 'arraybuffer';

				request.onload = function() {
					if(callback) {
						callback(request.response);
					}
				};

				request.onerror = function() {
					if(callbackError) {
						callbackError(request);
					}
				};

				request.send();
				break;
			default:
				request.onload = function() {
					if(callback) {
						callback(request.response);
					}
				};

				request.onerror = function() {
					if(callbackError) {
						callbackError(request);
					}
				};

				request.send();
				break;
		}
	},
	/**
	 * Decode an ArrayBuffer to an AudioBuffer
	 * @param {ArrayBuffer} arrayBuffer - Buffer
	 * @param {function} callback - Callback on complete
	 * @param {function} callbackError - Callback on error
	 */
	decodeAudio : function(arrayBuffer, callback, callbackError) {
		Aural.Utils.XHR.audioContext = Aural.Utils.XHR.audioContext || new webkitAudioContext();
		Aural.Utils.XHR.audioContext.decodeAudioData(arrayBuffer, callback, callbackError);
	}
};