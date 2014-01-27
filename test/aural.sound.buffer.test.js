module("Aural.Sound.Buffer");

test('empty', function() {
	var buffer = new Aural.Sound.Buffer();

	equal(buffer.length, 0);
	equal(buffer.duration, 0);
	equal(buffer.numberOfChannels, 1);
	equal(buffer.getSample(1), 0);
});

test('mono', function() {
	var buffer = new Aural.Sound.Buffer(function() {
		var data = [];
		for(var x = 0; x < 10000; x++) {
			data.push(Math.sin(x / 10));
		}
		return data;
	});

	equal(buffer.length, 10000);
	equal(Math.round(buffer.duration * 1000) / 1000, 0.208);
	equal(buffer.numberOfChannels, 1);
	equal(buffer.getSample(0), 0);
	
	equal(Math.round(buffer.getSample(0.5) * 1000) / 1000, 0.05);
	equal(Math.round(buffer.getSample(1) * 1000) / 1000, 0.1);
	equal(Math.round(buffer.getSample(1.5) * 1000) / 1000, 0.149);
	equal(Math.round(buffer.getSample(2) * 1000) / 1000, 0.199);
	equal(Math.round(buffer.getSample(2.5) * 1000) / 1000, 0.247);
	equal(Math.round(buffer.getSample(3, 0) * 1000) / 1000, 0.296);
	
	equal(Math.round(buffer.getSample(3, 1) * 1000) / 1000, 0);
	
	buffer.makeStereo();
	
	equal(buffer.length, 10000);
	equal(Math.round(buffer.duration * 1000) / 1000, 0.208);
	equal(buffer.numberOfChannels, 2);
	equal(buffer.getSample(0), 0);
	
	equal(Math.round(buffer.getSample(3, 1) * 1000) / 1000, 0.296);
});

if(!window['_phantom']) {
	asyncTest('stereo', function() {
		expect(16);
		Aural.Utils.XHR.load(
			'./res/sounds/tone1.wav',
			'audio',
			function(file) {
				var buffer = new Aural.Sound.Buffer(file);
				
				equal(buffer.numberOfChannels, 2);
				equal(buffer.length, 354462);
				equal(Math.round(buffer.duration * 1000) / 1000, 7.385);
				
				equal(Math.round(buffer.getSample(200, 0) * 1000) / 1000, -0.164);
				equal(Math.round(buffer.getSample(200.5, 0) * 1000) / 1000, -0.169);
				equal(Math.round(buffer.getSample(201, 0) * 1000) / 1000, -0.174);
				equal(Math.round(buffer.getSample(200, 1) * 1000) / 1000, -0.155);
				equal(Math.round(buffer.getSample(200.5, 1) * 1000) / 1000, -0.16);
				equal(Math.round(buffer.getSample(201, 1) * 1000) / 1000, -0.164);
				
				buffer.makeMono(true);
				equal(buffer.numberOfChannels, 1);
				equal(buffer.length, 354462);
				equal(Math.round(buffer.duration * 1000) / 1000, 7.385);
				
				equal(Math.round(buffer.getSample(200, 0) * 1000) / 1000, -0.159);
				equal(Math.round(buffer.getSample(200.5, 0) * 1000) / 1000, -0.164);
				equal(Math.round(buffer.getSample(201, 0) * 1000) / 1000, -0.169);
				
				equal(buffer.getSample(201, 1), 0);
				
				start();
			}
		);
	});
}