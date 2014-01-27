module("Aural.Utils.XHR");

//TODO test mml

asyncTest('single sfz file', function() {
	expect(2);
	Aural.Utils.XHR.load(
		'./res/sfz/test.sfz',
		'sfz',
		function(file) {
			equal(file.constructor, Aural.Utils.Sfz.File);
			equal(file.regions.length, 3);
			start();
		}
	);
});

asyncTest('single midi file', function() {
	expect(2);
	Aural.Utils.XHR.load(
		'./res/midi/Ritsu_scale_on_E.mid',
		'midi',
		function(file) {
			equal(file.constructor, Aural.Utils.Midi.File);
			equal(file.trackNumber, 2);
			start();
		}
	);
});

asyncTest('single scala file', function() {
	expect(3);
	Aural.Utils.XHR.load(
		'./res/scala/pyth_12.scl',
		'scala',
		function(file) {
			equal(file.constructor, Aural.Utils.Scala.File);
			equal(file.description, '12-tone Pythagorean scale');
			equal(file.intervals.length, 12);
			start();
		}
	);
});

asyncTest('single array file', function() {
	expect(2);
	Aural.Utils.XHR.load(
		'./res/sounds/tone1.wav',
		'array',
		function(file) {
			equal(file.constructor, ArrayBuffer);
			equal(file.byteLength, 2605442 );
			start();
		}
	);
});

asyncTest('missing file', function() {
	expect(1);
	Aural.Utils.XHR.load(
		'./res/midi/missing.mid',
		'midi',
		function(file) {},
		function(xhr) {
			equal(xhr.status, 404);
			start();
		}
	);
});

if(!window['_phantom']) {
	asyncTest('single audio file', function() {
		expect(3);
		Aural.Utils.XHR.load(
			'./res/sounds/tone1.wav',
			'audio',
			function(file) {
				equal(file.constructor, AudioBuffer);
				equal(file.numberOfChannels, 2);
				equal(file.length, 354462);
				start();
			}
		);
	});
	
	asyncTest('multiple files serial', function() {
		Aural.Utils.XHR.serialLoad(
			[
				{ url : './res/sfz/test.sfz', 'type' : 'sfz', 'id' : 'test-sfz' },
				{ url : './res/midi/Ritsu_scale_on_E.mid', 'type' : 'midi', 'id' : 'ritsu-midi' },
				{ url : './res/sfz/test.sfz', 'id' : 'test-text' },
				{ url : './res/scala/pyth_12.scl', 'type' : 'scala', 'id' : 'pyth12-scala' },
				{ url : './res/sounds/tone1.wav', 'type' : 'audio', 'id' : 'tone1-audio' },
				{ url : './res/sounds/tone1.wav', 'type' : 'array', 'id' : 'tone1-array' }
			],
			function(data, id, url) {
				switch(id) {
					case 'test-sfz':
						equal(data.constructor, Aural.Utils.Sfz.File);
						break;
					case 'test-text':
						equal(typeof data, 'string');
						break;
					case 'ritsu-midi':
						equal(data.constructor, Aural.Utils.Midi.File);
						break;
					case 'pyth12-scala':
						equal(data.constructor, Aural.Utils.Scala.File);
						break;
					case 'tone1-audio':
						equal(data.constructor, AudioBuffer);
						break;
					case 'tone1-array':
						equal(data.constructor, ArrayBuffer);
						break;
				}
			},
			function(files) {
				equal(files[0].error, false);
				equal(files[0].data.constructor, Aural.Utils.Sfz.File);
				equal(files[1].error, false);
				equal(files[1].data.constructor, Aural.Utils.Midi.File);
				equal(files[2].error, false);
				equal(typeof files[2].data, 'string');
				equal(files[3].error, false);
				equal(files[3].data.constructor, Aural.Utils.Scala.File);
				equal(files[4].error, false);
				equal(files[4].data.constructor, AudioBuffer);
				equal(files[5].error, false);
				equal(files[5].data.constructor, ArrayBuffer);
				start();
			}
		);
	});

	asyncTest('multiple files parallel', function() {
		Aural.Utils.XHR.parallelLoad(
			[
				{ url : './res/sfz/test.sfz', 'type' : 'sfz', 'id' : 'test-sfz' },
				{ url : './res/midi/Ritsu_scale_on_E.mid', 'type' : 'midi', 'id' : 'ritsu-midi' },
				{ url : './res/sfz/test.sfz', 'id' : 'test-text' },
				{ url : './res/scala/pyth_12.scl', 'type' : 'scala', 'id' : 'pyth12-scala' },
				{ url : './res/sounds/tone1.wav', 'type' : 'audio', 'id' : 'tone1-audio' },
				{ url : './res/sounds/tone1.wav', 'type' : 'array', 'id' : 'tone1-array' }
			],
			function(data, id, url) {
				switch(id) {
					case 'test-sfz':
						equal(data.constructor, Aural.Utils.Sfz.File);
						break;
					case 'test-text':
						equal(typeof data, 'string');
						break;
					case 'ritsu-midi':
						equal(data.constructor, Aural.Utils.Midi.File);
						break;
					case 'pyth12-scala':
						equal(data.constructor, Aural.Utils.Scala.File);
						break;
					case 'tone1-audio':
						equal(data.constructor, AudioBuffer);
						break;
					case 'tone1-array':
						equal(data.constructor, ArrayBuffer);
						break;
				}
			},
			function(files) {
				equal(files[0].error, false);
				equal(files[0].data.constructor, Aural.Utils.Sfz.File);
				equal(files[1].error, false);
				equal(files[1].data.constructor, Aural.Utils.Midi.File);
				equal(files[2].error, false);
				equal(typeof files[2].data, 'string');
				equal(files[3].error, false);
				equal(files[3].data.constructor, Aural.Utils.Scala.File);
				equal(files[4].error, false);
				equal(files[4].data.constructor, AudioBuffer);
				equal(files[5].error, false);
				equal(files[5].data.constructor, ArrayBuffer);
				start();
			}
		);
	});
}