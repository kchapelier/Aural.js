module("Aural.Utils.Midi.ControlChangesDictionary");

test('getName', function() {
	equal(Aural.Utils.Midi.ControlChangesDictionary.getName(1), 'modulation wheel');
	equal(Aural.Utils.Midi.ControlChangesDictionary.getName(10), 'pan');
	equal(Aural.Utils.Midi.ControlChangesDictionary.getName(120), 'all sound off');

	strictEqual(Aural.Utils.Midi.ControlChangesDictionary.getName(999), null);
});

test('get', function() {
	equal(Aural.Utils.Midi.ControlChangesDictionary.get(1).label, 'modulation wheel');
	equal(Aural.Utils.Midi.ControlChangesDictionary.get(1).shortname, 'mod');
	equal(Aural.Utils.Midi.ControlChangesDictionary.get(10).label, 'pan');
	equal(Aural.Utils.Midi.ControlChangesDictionary.get(120).label, 'all sound off');

	strictEqual(Aural.Utils.Midi.ControlChangesDictionary.get(999), null);
});

test('getCC', function() {
	equal(Aural.Utils.Midi.ControlChangesDictionary.getCC('modulation wheel'), 1);
	equal(Aural.Utils.Midi.ControlChangesDictionary.getCC('mod'), 1);
	equal(Aural.Utils.Midi.ControlChangesDictionary.getCC('pan'), 10);
	equal(Aural.Utils.Midi.ControlChangesDictionary.getCC('all sound off'), 120);

	strictEqual(Aural.Utils.Midi.ControlChangesDictionary.getCC('missing control change'), null);
});