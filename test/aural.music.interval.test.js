module("Aural.Music.Interval");

test('interval A4 to A5', function() {
	var note1 = Aural.Music.Note.createFromLabel('A4');
	var note2 = Aural.Music.Note.createFromLabel('A5');

	var interval = Aural.Music.IntervalList.match(note1, note2);

	equal(interval.cents, 1200, 'interval between those two notes should be 1200');
	equal((interval.titles.indexOf('octave') >= 0), true, 'interval between those two notes should be named octave');

	interval = Aural.Music.IntervalList.match(note2, note1);

	equal(interval.cents, 1200, 'interval between those two notes should be 1200, even if passed from bigger to smaller');
	equal((interval.titles.indexOf('octave') >= 0), true, 'interval between those two notes should be named octave, even if passed from bigger to smaller');
});

test('interval semitone', function() {
	var interval = Aural.Music.IntervalList.getInterval('semitone');

	equal(interval.cents, 100, 'interval semitone should be 100');

	var note1 = Aural.Music.Note.createFromLabel('A4');
	var note2 = interval.getNoteAtInterval(note1);

	equal(Math.floor(note2.frequency * 1000) / 1000, 466.163, 'A4 + 1 semitone should be 466.163 in default tuning');
	equal(note2.cents, 0, 'A4 + 1 semitone should have 0 cents');
	equal(note2.label, 'A#', 'A4 + 1 semitone should have A# as label');
	equal(note2.octave, 4, 'A4 + 1 semitone should have 4 as octave');
	equal(note2.midi, 70, 'A4 + 1 semitone should have 70 as midi value');

	var note3 = interval.getNoteAtInterval(note1, -1);

	equal(Math.floor(note3.frequency * 1000) / 1000, 415.304, 'A4 - 1 semitone should be 415.304 in default tuning');
	equal(note3.cents, 0, 'A4 - 1 semitone should have 0 cents');
	equal(note3.label, 'G#', 'A4 - 1 semitone should have G# as label');
	equal(note3.octave, 4, 'A4 - 1 semitone should have 4 as octave');
	equal(note3.midi, 68, 'A4 - 1 semitone should have 68 as midi value');

	var note4 = interval.getNoteAtInterval(note1, 5);

	equal(Math.floor(note4.frequency * 1000) / 1000, 587.329, 'A4 + 5 semitones should be 587.329 in default tuning');
	equal(note4.cents, 0, 'A4 + 5 semitones should have 0 cents');
	equal(note4.label, 'D', 'A4 + 5 semitones should have D as label');
	equal(note4.octave, 5, 'A4 + 5 semitones should have 5 as octave');
	equal(note4.midi, 74, 'A4 + 5 semitones should have 74 as midi value');
});

test('interval shorthand', function() {
	var note = Aural.Music.Note.createFromLabel('A4');

	note.applyInterval('equal-tempered tritone');

	equal(Math.floor(note.frequency * 1000) / 1000, 622.253, 'A4 + 1 tritone should be 622.253 in default tuning');
	equal(note.cents, 0, 'A4 + 1 tritone should have 0 cents');
	equal(note.label, 'D#', 'A4 + 1 tritone should have D# as label');
	equal(note.octave, 5, 'A4 + 1 tritone should have 5 as octave');
	equal(note.midi, 75, 'A4 + 1 tritone should have 75 as midi value');

	note = Aural.Music.Note.createFromLabel('A4');

	note.applyInterval('semitone', -1);

	equal(Math.floor(note.frequency * 1000) / 1000, 415.304, 'A4 - 1 semitone should be 415.304 in default tuning');
	equal(note.cents, 0, 'A4 - 1 semitone should have 0 cents');
	equal(note.label, 'G#', 'A4 - 1 semitone should have G# as label');
	equal(note.octave, 4, 'A4 - 1 semitone should have 4 as octave');
	equal(note.midi, 68, 'A4 - 1 semitone should have 68 as midi value');
});