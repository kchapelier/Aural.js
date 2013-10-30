
test('note label A4', function() {
	var note = Aural.Music.Note.createFromLabel('A4');
	equal(note.frequency, 440, 'A4 should be 440 in default tuning');
	equal(note.cents, 0, 'A4 should have 0 cents');
	equal(note.label, 'A', 'A4 should have A as label');
	equal(note.octave, 4, 'A4 should have 4 as octave');
	equal(note.midi, 69, 'A4 should have 69 as midi value');
});

test('note label C6+10c', function() {
	var note = Aural.Music.Note.createFromLabel('C', 6, 10);
	equal(Math.floor(note.frequency * 1000) / 1000, 1052.564, 'C6+10c should be 1052.564 in default tuning');
	equal(note.cents, 10, 'C6+10c should have 10 cents');
	equal(note.label, 'C', 'C6+10c should have C as label');
	equal(note.octave, 6, 'C6+10c should have 6 as octave');
	equal(note.midi, 84, 'C6+10c should have 84 as midi value');
});

test('note label A implied A0', function() {
	var note = Aural.Music.Note.createFromLabel('A');
	equal(note.frequency, 27.5, 'A should be 27.5 in default tuning');
	equal(note.cents, 0, 'A should have 0 cents');
	equal(note.label, 'A', 'A should have A as label');
	equal(note.octave, 0, 'A should have 0 as octave');
	equal(note.midi, 21, 'A should have 21 as midi value');
});

test('note label 440hz', function() {
	var note = Aural.Music.Note.createFromFrequency(440);
	equal(note.frequency, 440, '440hz should be 440 in default tuning');
	equal(note.cents, 0, '440hz should have 0 cents');
	equal(note.label, 'A', '440hz should have A as label');
	equal(note.octave, 4, '440hz should have 4 as octave');
	equal(note.midi, 69, '440hz should have 69 as midi value');
});

test('note label 124.55hz', function() {
	var note = Aural.Music.Note.createFromFrequency(124.55);
	equal(note.frequency, 124.55, '124.55hz should be 124.55 in default tuning');
	equal(Math.floor(note.cents * 1000) / 1000, 15.065, '124.55hz should have 15.065 cents');
	equal(note.label, 'B', '124.55hz should have B as label');
	equal(note.octave, 2, '124.55hz should have 2 as octave');
	equal(note.midi, 47, '124.55hz should have 47 as midi value');
});

test('note label 69', function() {
	var note = Aural.Music.Note.createFromMidi(69);
	equal(note.frequency, 440, '60 should be 440 in default tuning');
	equal(note.cents, 0, '60 should have 0 cents');
	equal(note.label, 'A', '60 should have A as label');
	equal(note.octave, 4, '60 should have 4 as octave');
	equal(note.midi, 69, '60 should have 69 as midi value');
});

test('note label 91-60c', function() {
	var note = Aural.Music.Note.createFromMidi(91, -60);
	equal(Math.floor(note.frequency * 1000) / 1000, 1514.570, '91-60c should be 1514.570 in default tuning');
	equal(note.cents, -60, '91-60c should have -60 cents');
	equal(note.label, 'G', '91-60c should have G as label');
	equal(note.octave, 6, '91-60c should have 6 as octave');
	equal(note.midi, 91, '91-60c should have 91 as midi value');
});

test('note label 0', function() {
	var note = Aural.Music.Note.createFromMidi(0);
	equal(Math.floor(note.frequency * 1000) / 1000, 8.175, '0 should be 8.175 in default tuning');
	equal(note.cents, 0, '0 should have 0 cents');
	equal(note.label, 'C', '0 should have C as label');
	equal(note.octave, -1, '0 should have -1 as octave');
	equal(note.midi, 0, '0 should have 0 as midi value');
});

test('note label -3', function() {
	var note = Aural.Music.Note.createFromMidi(-3);
	equal(note.frequency, 6.875, '-3 should be 6.875 in default tuning');
	equal(note.cents, 0, '-3 should have 0 cents');
	equal(note.label, 'A', '-3 should have A as label');
	equal(note.octave, -2, '-3 should have -2 as octave');
	equal(note.midi, -3, '-3 should have -3 as midi value');
});


test('note label Ab', function() {
	var note = Aural.Music.Note.createFromLabel('Ab');
	//equal(note.frequency, 440, '60 should be 440 in default tuning');
	//equal(note.cents, 0, '60 should have 0 cents');
	equal(note.label, 'G#', 'Ab is equal to G#');
	//equal(note.octave, 4 '60 should have 4 as octave');
	//equal(note.midi, 69, '60 should have 69 as midi value');
});

test('note label B#', function() {
	var note = Aural.Music.Note.createFromLabel('B#');
	//equal(note.frequency, 440, '60 should be 440 in default tuning');
	//equal(note.cents, 0, '60 should have 0 cents');
	equal(note.label, 'C', 'B# is equal to C');
	//equal(note.octave, 4 '60 should have 4 as octave');
	//equal(note.midi, 69, '60 should have 69 as midi value');
});

test('note label Fb', function() {
	var note = Aural.Music.Note.createFromLabel('Fb');
	//equal(note.frequency, 440, '60 should be 440 in default tuning');
	//equal(note.cents, 0, '60 should have 0 cents');
	equal(note.label, 'E', 'Fb is equal to E');
	//equal(note.octave, 4 '60 should have 4 as octave');
	//equal(note.midi, 69, '60 should have 69 as midi value');
});