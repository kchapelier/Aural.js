"use strict";

/**
 * XmlHttpRequest helper specialized in handling files and multiple requests at once
 * @type {object}
 */
Aural.Utils.XHR = {
	preferredMode : 'serial',
	/**
	 * Executes multiple requests 
	 * @param {object[]} files - Array of objects with an 'url', an 'id' and a 'type'
	 * @param {function} [callbackFile] - Callback on complete per request
	 * @param {function} [callbackFinal] - Callback on complete
	 * @param {function} [callbackError] - Callback on failure (one failure means the end of the requests)
	 */
	multiLoad : function(files, callbackFile, callbackFinal, callbackError) {
		if(Aural.Utils.XHR.preferredMode === 'serial') {
			this.serialLoad(files, callbackFile, callbackFinal, callbackError);
		} else {
			this.parallelLoad(files, callbackFile, callbackFinal, callbackError);
		}
	},
	/**
	 * Executes successive requests 
	 * @param {object[]} files - Array of objects with an 'url', an 'id' and a 'type'
	 * @param {function} [callbackFile] - Callback on complete per request
	 * @param {function} [callbackFinal] - Callback on complete
	 * @param {function} [callbackError] - Callback on failure (one failure means the end of the requests)
	 */
	serialLoad : function(files, callbackFile, callbackFinal, callbackError) {
		var loading = 0;

		var loaderCallback = function(data) {
			if(callbackFile) {
				callbackFile(data, files[loading].id, files[loading].url);
			}

			files[loading].data = data;
			files[loading].error = false;

			loading++;

			if(loading < files.length) {
				loader();
			} else {
				if(callbackFinal) {
					callbackFinal(files);
				}
			}
		};

		var loader = function() {
			var url = files[loading].url;
			var type = files[loading].type;

			Aural.Utils.XHR.load(url, type, loaderCallback, callbackError);
		};

		if(files.length > 0) {
			loader();
		} else {
			if(callbackFinal) {
				callbackFinal(files);
			}
		}
	},
	/**
	 * Executes parallel requests
	 * @param {object[]} files - Array of objects with an 'url', an 'id' and a 'type'
	 * @param {function} [callbackFile] - Callback on complete per request
	 * @param {function} [callbackFinal] - Callback on complete
	 * @param {function} [callbackError] - Callback on failure (one failure means the end of the requests)
	 */
	parallelLoad : function(files, callbackFile, callbackFinal, callbackError) {
		var loaded = 0;
		var error = false;

		var iteration = function(files, i) {
			var file = files[i];
			Aural.Utils.XHR.load(
				file.url,
				file.type,
				function(data) {
					if(!error) {
						if(callbackFile) {
							callbackFile(data, file.id, file.url);
						}

						files[i].data = data;
						files[i].error = false;

						loaded++;

						if(loaded === files.length && callbackFinal) {
							callbackFinal(files);
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

		if(files.length > 0) {
			for(var i = 0, l = files.length; i < l; i++) {
				iteration(files, i);
			}
		} else {
			if(callbackFinal) {
				callbackFinal(files);
			}
		}
	},
	/**
	 * Execute one request
	 * @param {string} url - Url
	 * @param {string} [type] - Type expected (audio for an AudioBuffer, array for an ArrayBuffer, sfz for a soundfont file, midi for a midi file, mml for a mml file, scala for a scala file)
	 * @param {function} [callback] - Callback on complete
	 * @param {function} [callbackError] - Callback on failure
	 */
	load : function(url, type, callback, callbackError) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);

		switch(type) {
			case 'sfz':
				request.onload = function() {
					var file = Aural.Utils.Sfz.File.loadFromString(request.response);

					if(callback) {
						callback(file);
					}
				};

				request.onerror = function() {
					if(callbackError) {
						callbackError(request);
					}
				};

				request.send();
				break;
			case 'mml':
				request.onload = function() {
					var file = new Aural.Utils.MML.File(request.response);

					if(callback) {
						callback(file);
					}
				};

				request.onerror = function() {
					if(callbackError) {
						callbackError(request);
					}
				};

				request.send();
				break;
			case 'scala':
				request.onload = function() {
					try {
						var file = new Aural.Utils.Scala.File(request.response);

						if(callback) {
							callback(file);
						}
					} catch(e) {
						if(callbackError) {
							callbackError(request);
						}
					}
				};

				request.onerror = function() {
					if(callbackError) {
						callbackError(request);
					}
				};

				request.send();
				break;
			case 'midi':
				request.responseType = 'arraybuffer';

				request.onload = function() {
					try {
						var file = new Aural.Utils.Midi.File(request.response);

						if(callback) {
							callback(file);
						}
					} catch(e) {
						if(callbackError) {
							callbackError(request);
						}
					}
				};

				request.onerror = function() {
					if(callbackError) {
						callbackError(request);
					}
				};

				request.send();
				break;
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
			case 'array':
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
	 * @param {function} [callback] - Callback on complete
	 * @param {function} [callbackError] - Callback on error
	 */
	decodeAudio : function(arrayBuffer, callback, callbackError) {
		var ac = Aural.Utils.Support.getAudioContext();
		ac.decodeAudioData(arrayBuffer, callback, callbackError);
	}
};