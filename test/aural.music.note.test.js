module("Aural.Music.Note");

test('note label A4', function() {
	var note = Aural.Music.Note.createFromLabel('A4');
	equal(note.frequency, 440, 'A4 should be 440 in default tuning');
	equal(note.cents, 0, 'A4 should have 0 cents');
	equal(note.label, 'A', 'A4 should have A as label');
	equal(note.octave, 4, 'A4 should have 4 as octave');
	equal(note.midi, 69, 'A4 should have 69 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 2.272, 'A4 should have a period of 2.272');
	equal(note.getSolfegeName(), 'La', 'A4 should be a La');
});

test('note label C6+10c', function() {
	var note = Aural.Music.Note.createFromLabel('C', 6, 10);
	equal(Math.floor(note.frequency * 1000) / 1000, 1052.564, 'C6+10c should be 1052.564 in default tuning');
	equal(note.cents, 10, 'C6+10c should have 10 cents');
	equal(note.label, 'C', 'C6+10c should have C as label');
	equal(note.octave, 6, 'C6+10c should have 6 as octave');
	equal(note.midi, 84, 'C6+10c should have 84 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 0.95, 'C6+10c should have a period of 0.95');
	equal(note.getSolfegeName(), 'Do', 'C6+10c should be a Do');
});

test('note label A implied A0', function() {
	var note = Aural.Music.Note.createFromLabel('A');
	equal(note.frequency, 27.5, 'A should be 27.5 in default tuning');
	equal(note.cents, 0, 'A should have 0 cents');
	equal(note.label, 'A', 'A should have A as label');
	equal(note.octave, 0, 'A should have 0 as octave');
	equal(note.midi, 21, 'A should have 21 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 36.363, 'A should have a period of 36.363');
	equal(note.getSolfegeName(), 'La', 'A should be a La');
});

test('note freq 440hz', function() {
	var note = Aural.Music.Note.createFromFrequency(440);
	equal(note.frequency, 440, '440hz should be 440 in default tuning');
	equal(note.cents, 0, '440hz should have 0 cents');
	equal(note.label, 'A', '440hz should have A as label');
	equal(note.octave, 4, '440hz should have 4 as octave');
	equal(note.midi, 69, '440hz should have 69 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 2.272, '440hz should have a period of 2.272');
	equal(note.getSolfegeName(), 'La', '440hz should be a La');
});

test('note freq -440hz', function() {
	var note = Aural.Music.Note.createFromFrequency(-440);
	equal(note.frequency, 440, '-440hz should be 440 in default tuning');
	equal(note.cents, 0, '-440hz should have 0 cents');
	equal(note.label, 'A', '-440hz should have A as label');
	equal(note.octave, 4, '-440hz should have 4 as octave');
	equal(note.midi, 69, '-440hz should have 69 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 2.272, '-440hz should have a period of 2.272');
	equal(note.getSolfegeName(), 'La', '-440hz should be a La');
});

test('note freq 124.55hz', function() {
	var note = Aural.Music.Note.createFromFrequency(124.55);
	equal(note.frequency, 124.55, '124.55hz should be 124.55 in default tuning');
	equal(Math.floor(note.cents * 1000) / 1000, 15.065, '124.55hz should have 15.065 cents');
	equal(note.label, 'B', '124.55hz should have B as label');
	equal(note.octave, 2, '124.55hz should have 2 as octave');
	equal(note.midi, 47, '124.55hz should have 47 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 8.028, '124.55hz should have a period of 8.028');
	equal(note.getSolfegeName(), 'Ti', '124.55hz should be a Ti');
});

test('note midi 69', function() {
	var note = Aural.Music.Note.createFromMidi(69);
	equal(note.frequency, 440, '69 should be 440 in default tuning');
	equal(note.cents, 0, '69 should have 0 cents');
	equal(note.label, 'A', '69 should have A as label');
	equal(note.octave, 4, '69 should have 4 as octave');
	equal(note.midi, 69, '69 should have 69 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 2.272, '69 should have a period of 2.272');
	equal(note.getSolfegeName(), 'La', '69 should be a La');
});

test('note midi 91-60c', function() {
	var note = Aural.Music.Note.createFromMidi(91, -60);
	equal(Math.floor(note.frequency * 1000) / 1000, 1514.570, '91-60c should be 1514.570 in default tuning');
	equal(note.cents, -60, '91-60c should have -60 cents');
	equal(note.label, 'G', '91-60c should have G as label');
	equal(note.octave, 6, '91-60c should have 6 as octave');
	equal(note.midi, 91, '91-60c should have 91 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 0.66, '91-60c should have a period of 0.66');
	equal(note.getSolfegeName(), 'Sol', '91-60c should be a Sol');
});

test('note midi 0', function() {
	var note = Aural.Music.Note.createFromMidi(0);
	equal(Math.floor(note.frequency * 1000) / 1000, 8.175, '0 should be 8.175 in default tuning');
	equal(note.cents, 0, '0 should have 0 cents');
	equal(note.label, 'C', '0 should have C as label');
	equal(note.octave, -1, '0 should have -1 as octave');
	equal(note.midi, 0, '0 should have 0 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 122.312, '0 should have a period of 122.312');
	equal(note.getSolfegeName(), 'Do', '0 should be a Do');
});

test('note midi -3', function() {
	var note = Aural.Music.Note.createFromMidi(-3);
	equal(note.frequency, 6.875, '-3 should be 6.875 in default tuning');
	equal(note.cents, 0, '-3 should have 0 cents');
	equal(note.label, 'A', '-3 should have A as label');
	equal(note.octave, -2, '-3 should have -2 as octave');
	equal(note.midi, -3, '-3 should have -3 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 145.454, '-3 should have a period of 145.454');
	equal(note.getSolfegeName(), 'La', '-3 should be a La');
});


test('note label Ab', function() {
	var note = Aural.Music.Note.createFromLabel('Ab');
	equal(Math.floor(note.frequency * 1000) / 1000, 25.956, 'Ab should be 25.956 in default tuning');
	equal(note.cents, 0, 'Ab should have 0 cents');
	equal(note.label, 'G#', 'Ab is equal to G#');
	equal(note.octave, 0, 'Ab should have 0 as octave');
	equal(note.midi, 20, 'Ab should have 20 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 38.525, 'Ab should have a period of 38.525');
	equal(note.getSolfegeName(), 'Sol#', 'Ab should be a Sol#');
});

test('note label B#', function() {
	var note = Aural.Music.Note.createFromLabel('B#');
	equal(Math.floor(note.frequency * 1000) / 1000, 32.703, 'B# should be 32.703 in default tuning');
	equal(note.cents, 0, 'B# should have 0 cents');
	equal(note.label, 'C', 'B# is equal to C');
	equal(note.octave, 1, 'B# should have 1 as octave as it resolves to the C of the following octave');
	equal(note.midi, 24, 'B# should have 24 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 30.578, 'B# should have a period of 30.578');
	equal(note.getSolfegeName(), 'Do', 'B# should be a Do');
});

test('note label Fb', function() {
	var note = Aural.Music.Note.createFromLabel('Fb');
	equal(Math.floor(note.frequency * 1000) / 1000, 20.601, 'Fb should be 20.601 in default tuning');
	equal(note.cents, 0, 'Fb should have 0 cents');
	equal(note.label, 'E', 'Fb is equal to E');
	equal(note.octave, 0, 'Fb should have 0 as octave');
	equal(note.midi, 16, 'Fb should have 16 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 48.539, 'Fb should have a period of 48.539');
	equal(note.getSolfegeName(), 'Mi', 'Fb should be a Mi');
});

test('note harmonic series', function() {
	var note = Aural.Music.Note.createFromLabel('C', 4, 10);

	var harmonics = note.getHarmonicSeries(10);

	equal(harmonics.length, 10, 'should have return 10 harmonics as requested');

	for(var i = 0, l = harmonics.length; i < l; i++) {
		equal(harmonics[i], note.frequency * (i + 1), 'harmonic ' + (i + 1) + ' doesnt meet the definition of an harmonic partial');
	}
});

test('note harmonic', function() {
	var note = Aural.Music.Note.createFromLabel('A', 4);

	var harmonic = note.getHarmonic(1);
	equal(Math.floor(harmonic.cents * 1000) / 1000, 0, '1st harmonic should be detuned by 0 cents');

	harmonic = note.getHarmonic(2);
	equal(Math.floor(harmonic.cents * 1000) / 1000, 0, '2nd harmonic should be detuned by 0 cents');

	harmonic = note.getHarmonic(3);
	equal(Math.floor(harmonic.cents * 1000) / 1000, 1.955, '3rd harmonic should be detuned by 1.955 cents');

	harmonic = note.getHarmonic(4);
	equal(Math.floor(harmonic.cents * 1000) / 1000, 0, '4th harmonic should be detuned by 0 cents');

	harmonic = note.getHarmonic(5);
	equal(Math.floor(harmonic.cents * 1000) / 1000, -13.687, '5th harmonic should be detuned by -13.687 cents');

	harmonic = note.getHarmonic(6);
	equal(Math.floor(harmonic.cents * 1000) / 1000, 1.955, '6th harmonic should be detuned by 1.955 cents');

	harmonic = note.getHarmonic(7);
	equal(Math.floor(harmonic.cents * 1000) / 1000, -31.175, '7th harmonic should be detuned by -31.175 cents');

	harmonic = note.getHarmonic(8);
	equal(Math.floor(harmonic.cents * 1000) / 1000, 0, '8th harmonic should be detuned by 0 cents');

	harmonic = note.getHarmonic(9);
	equal(Math.floor(harmonic.cents * 1000) / 1000, 3.910, '9th harmonic should be detuned by 3.910 cents');
});

test('note transpose', function() {
	var note = Aural.Music.Note.createFromLabel('A', 4);
	note.transpose(12);

	equal(note.frequency, 880, 'A4+12 should be 880 in default tuning');
	equal(note.cents, 0, 'A4+12 should have 0 cents');
	equal(note.label, 'A', 'A4+12 should have A as label');
	equal(note.octave, 5, 'A4+12 should have 5 as octave');
	equal(note.midi, 81, 'A4+12 should have 81 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 1.136, 'A4+12 should have a period of 1.136');
	equal(note.getSolfegeName(), 'La', 'A4+12 should be a La');

	note.transpose(0, -1200);

	equal(note.frequency, 440, 'A4+12-1200c should be 440 in default tuning');
	equal(note.cents, -1200, 'A4+12-1200c should have -1200 cents');
	equal(note.label, 'A', 'A4+12-1200c should have A as label');
	equal(note.octave, 5, 'A4+12-1200c should have 5 as octave');
	equal(note.midi, 81, 'A4+12-1200c should have 81 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 2.272, 'A4+12-1200c should have a period of 2.272');
	equal(note.getSolfegeName(), 'La', 'A4+12-1200c should be a La');

	note.transpose(-12, 1200);

	equal(note.frequency, 440, 'A4 should be 440 in default tuning');
	equal(note.cents, 0, 'A4 should have 0 cents');
	equal(note.label, 'A', 'A4 should have A as label');
	equal(note.octave, 4, 'A4 should have 4 as octave');
	equal(note.midi, 69, 'A4 should have 69 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 2.272, 'A4 should have a period of 2.272');
	equal(note.getSolfegeName(), 'La', 'A4 should be a La');
});

test('note set cents', function() {
	var note = Aural.Music.Note.createFromLabel('A', 4);
	note.setCents(-1200 * 4);

	equal(note.frequency, 27.5, 'A4-4800c should be 27.5 in default tuning');
	equal(note.cents, -4800, 'A4-4800c should have -4800 cents');
	equal(note.label, 'A', 'A4-4800c should have A as label');
	equal(note.octave, 4, 'A4-4800c should have 4 as octave');
	equal(note.midi, 69, 'A4-4800c should have 69 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 36.363, 'A4-4800c should have a period of 36.363');
	equal(note.getSolfegeName(), 'La', 'A4-4800c should be a La');

	note.setCents(10);

	equal(Math.floor(note.frequency * 1000) / 1000, 442.548, 'A4+10c should be 442.548 in default tuning');
	equal(note.cents, 10, 'A4+10c should have 10 cents');
	equal(note.label, 'A', 'A4+10c should have A as label');
	equal(note.octave, 4, 'A4+10c should have 4 as octave');
	equal(note.midi, 69, 'A4+10c should have 69 as midi value');
	equal(Math.floor(note.getPeriod() * 1000) / 1000, 2.259, 'A4+10c should have a period of 2.259');
	equal(note.getSolfegeName(), 'La', 'A4+10c should be a La');
});

test('note copy', function() {
	var note1 = Aural.Music.Note.createFromLabel('C', 2, 100);
	note2 = note1.copy();

	equal(note1.cents, note2.cents, 'copied note should have the same cents');
	equal(note1.label, note2.label, 'copied note should have the same label');
	equal(note1.octave, note2.octave, 'copied note should have the same octave');
	equal(note1.frequency, note2.frequency, 'copied note should have the same frequency');
	equal(note1.midi, note2.midi, 'copied note should have the same midi value');
});