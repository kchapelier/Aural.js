module("Aural.Utils.Sfz");

test('parse most basic', function() {
	var sfz = '\r\n//some file\r\n' + 
	'<region>\r\n' + 
	'sample=SOUND_1.wav \r\n' + 
	'pitch_keycenter=74\r\n' + 
	'lokey=72 hikey=76\r\n' + 
	'lovel=0 hivel=127\r\n\r\n\r\n' + 
	'<region>sample=SOUND_2.wav\r\n' + 
	'pitch_keycenter=C5\r\n' + 
	'lokey=77 hikey=81 //sample=machin\r\n' + 
	'lovel=0 hivel=127\r\n';

	var sfzFile = Aural.Utils.Sfz.File.loadFromString(sfz);

	equal(sfzFile.regions.length, 2, 'there should be 2 regions loaded');

	equal(sfzFile.regions[0].sample, 'SOUND_1.wav');
	equal(sfzFile.regions[0].pitchKeyCenter, 74);
	equal(sfzFile.regions[0].loKey, 72);
	equal(sfzFile.regions[0].hiKey, 76);
	equal(sfzFile.regions[0].loVelocity, 0);
	equal(sfzFile.regions[0].hiVelocity, 127);

	equal(sfzFile.regions[1].sample, 'SOUND_2.wav');
	equal(sfzFile.regions[1].pitchKeyCenter, 72);
	equal(sfzFile.regions[1].loKey, 77);
	equal(sfzFile.regions[1].hiKey, 81);
	equal(sfzFile.regions[1].loVelocity, 0);
	equal(sfzFile.regions[1].hiVelocity, 127);
});

test('parse groups', function() {
	var sfz = '\r\n//some file\r\n' + 
	'<region>sample=SOUND_1.wav\r\n' + 
	'<group>pitch_keycenter=50\r\n' +
	'<region>sample=SOUND_2.wav\r\n' + 
	'<region>sample=SOUND_2.wav\r\n' + 
	'<group>pitch_keycenter=51\r\n' +
	'<region>sample=SOUND_2.wav\r\n' + 
	'<region>sample=SOUND_2.wav pitch_keycenter=52';

	var sfzFile = Aural.Utils.Sfz.File.loadFromString(sfz);

	equal(sfzFile.regions.length, 5, 'there should be 5 regions loaded');

	equal(sfzFile.regions[0].pitchKeyCenter, 60);
	equal(sfzFile.regions[1].pitchKeyCenter, 50);
	equal(sfzFile.regions[2].pitchKeyCenter, 50);
	equal(sfzFile.regions[3].pitchKeyCenter, 51);
	equal(sfzFile.regions[4].pitchKeyCenter, 52);
});

test('parse ignore region without sample', function() {
	var sfz = '\r\n//some file\r\n' + 
	'<region>sample=SOUND_1.WAV pitch_keycenter=49\r\n' + 
	'<region>pitch_keycenter=50\r\n' + 
	'<group>sample=SOUND_1.WAV\r\n' +
	'<region>pitch_keycenter=51\r\n';

	var sfzFile = Aural.Utils.Sfz.File.loadFromString(sfz);

	equal(sfzFile.regions.length, 2, 'there should be 2 regions loaded');

	equal(sfzFile.regions[0].pitchKeyCenter, 49);
	equal(sfzFile.regions[1].pitchKeyCenter, 51);
});

test('parse sample with spaces', function() {
	var sfz = '<region>sample=/files/My new sample1.wav\r\n' +
	'pitch_keycenter=20\r\n' +
	'<region>sample=/files/My new sample2.wav pitch_keycenter=21\r\n';

	var sfzFile = Aural.Utils.Sfz.File.loadFromString(sfz);

	equal(sfzFile.regions.length, 2, 'there should be 2 regions loaded');

	equal(sfzFile.regions[0].sample, '/files/My new sample1.wav');
	equal(sfzFile.regions[1].sample, '/files/My new sample2.wav');
});