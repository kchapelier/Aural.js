module("Aural.Music.Chord");

test('chord power chord', function() {
	var chord = Aural.Music.ChordList.getChord('power chord');

	equal(chord.key, 'C', 'default key should be C');
	equal(chord.octave, 0, 'default octave should be 0');
	equal(chord.name, 'power chord', 'name should match with request');
	equal(chord.shortname, '5', 'power chord shortname should be 5');
	equal(chord.intervals.length, 2, 'power chord should have 2 intervals');

	equal(chord.getKeyOffset(), 12, 'power chord should have a key offset of 12');
	equal(chord.getType(), 'dyad', 'power chord should be a dyad');
	equal(chord.getNotesAsLabels().join(','), 'C,G', 'C power chord should be C,G');
});

test('chord major A implied A0', function() {
	var chord = Aural.Music.ChordList.getChord('major', 'A');

	equal(chord.key, 'A', 'A major key should be A');
	equal(chord.octave, 0, 'default octave should be 0');
	equal(chord.name, 'major', 'name should match with request');
	equal(chord.shortname, '', 'A major shortname should be (empty)');
	equal(chord.intervals.length, 3, 'A major should have 3 intervals');

	equal(chord.getKeyOffset(), 21, 'A major should have a key offset of 21');
	equal(chord.getType(), 'triad', 'A major should be a triad');
	equal(chord.getNotesAsLabels().join(','), 'A,C#,E', 'A major should be A,C#,E');
});

test('chord minor Bb2', function() {
	var chord = Aural.Music.ChordList.getChord('minor', 'Bb', 2);

	equal(chord.key, 'A#', 'Bb minor key should be A');
	equal(chord.octave, 2, 'octave should be 2');
	equal(chord.name, 'minor', 'name should match with request');
	equal(chord.shortname, 'm', 'Bb minor shortname should be m');
	equal(chord.intervals.length, 3, 'Bb minor should have 3 intervals');

	equal(chord.getKeyOffset(), 46, 'Bb minor should have a key offset of 46');
	equal(chord.getType(), 'triad', 'Bb minor should be a triad');
	equal(chord.getNotesAsLabels().join(','), 'A#,C#,F', 'Bb minor should be A#,C#,F');
});

test('chord dominant seventh C-1', function() {
	var chord = Aural.Music.ChordList.getChord('C-1 dominant seventh');

	equal(chord.key, 'C', 'C dominant seventh key should be C');
	equal(chord.octave, -1, 'octave should be -1');
	equal(chord.name, 'dominant seventh', 'name should match with request');
	equal(chord.shortname, '7', 'C dominant seventh shortname should be 7');
	equal(chord.intervals.length, 4, 'C dominant seventh should have 4 intervals');

	equal(chord.getKeyOffset(), 0, 'C dominant seventh should have a key offset of 0');
	equal(chord.getType(), 'tetrad', 'C dominant seventh should be a tetrad');
	equal(chord.getNotesAsLabels().join(','), 'C,E,G,A#', 'C dominant seventh should be C,E,G,A#');
});

test('chord augmented dominant ninth D#3', function() {
	var chord = Aural.Music.ChordList.getChord('D#3aug9');

	equal(chord.key, 'D#', 'D# augmented dominant ninth key should be D#');
	equal(chord.octave, 3, 'octave should be 3');
	equal(chord.name, 'augmented dominant ninth', 'name should match with request');
	equal(chord.shortname, 'aug9', 'D# augmented dominant ninth shortname should be aug9');
	equal(chord.intervals.length, 5, 'D# augmented dominant ninth should have 5 intervals');

	equal(chord.getKeyOffset(), 51, 'D# augmented dominant ninth should have a key offset of 51');
	equal(chord.getType(), 'pentad', 'D# augmented dominant ninth should be a pentad');
	equal(chord.getNotesAsLabels().join(','), 'D#,G,B,C#,F', 'D# augmented dominant ninth should be D#,G,B,C#,F');
});

test('chord copy', function() {
	var chord1 = Aural.Music.ChordList.getChord('Cm');
	var chord2 = chord1.copy('B');
	var chord3 = chord1.copy('E#', 2);

	equal(chord1.key, 'C', 'key should be C');
	equal(chord1.octave, 0, 'octave should be 0');
	equal(chord1.getNotesAsLabels().join(','), 'C,D#,G', 'B minor should be C,D#,G');

	equal(chord2.key, 'B', 'key should be B');
	equal(chord2.octave, 0, 'octave should be 0');
	equal(chord2.getNotesAsLabels().join(','), 'B,D,F#', 'B minor should be B,D,F#');
	
	equal(chord3.key, 'F', 'key should be F');
	equal(chord3.octave, 2, 'octave should be 2');
	equal(chord3.getNotesAsLabels().join(','), 'F,G#,C', 'E# minor should be F,G#,C');
});

test('chord transpose', function() {
	var chord = Aural.Music.ChordList.getChord('Cm');

	chord.transpose(5);

	equal(chord.key, 'F', 'key should be F');
	equal(chord.octave, 0, 'octave should be 0');
	equal(chord.getNotesAsLabels().join(','), 'F,G#,C', 'B minor should be F,G#,C');

	chord.transpose(-8);

	equal(chord.key, 'A', 'key should be A');
	equal(chord.octave, -1, 'octave should be -1');
	equal(chord.getNotesAsLabels().join(','), 'A,C,E', 'B minor should be A,C,E');
});

test('chord set key', function() {
	var chord = Aural.Music.ChordList.getChord('Cm');

	chord.setKey('B2');

	equal(chord.key, 'B', 'key should be B');
	equal(chord.octave, 2, 'octave should be 2');
	equal(chord.getNotesAsLabels().join(','), 'B,D,F#', 'B minor should be B,D,F#');

	chord.setKey('E1');

	equal(chord.key, 'E', 'key should be E');
	equal(chord.octave, 1, 'octave should be 1');
	equal(chord.getNotesAsLabels().join(','), 'E,G,B', 'B minor should be E,G,B');
});

test('chord get notes', function() {
	var chord = Aural.Music.ChordList.getChord('B3m');

	var notes = chord.getNotes();

	equal(notes.length, 3, 'major chord should have 3 notes');
	
	equal(Math.floor(notes[0].frequency * 1000) / 1000, 246.941, '1st note of the B3 minor chord should be 246.941hz');
	equal(notes[0].label, 'B', '1st note of the B3 minor chord should be B');
	equal(notes[0].octave, 3, '1st note of the B3 minor chord should be of octave 3');
	equal(notes[0].cents, 0, '1st note of the B3 minor chord should be 0cts');
	equal(notes[0].midi, 59, '1st note of the B3 minor chord should be midi value 59');

	equal(Math.floor(notes[1].frequency * 1000) / 1000, 293.664, '2nd note of the B3 minor chord should be 293.664hz');
	equal(notes[1].label, 'D', '2nd note of the B3 minor chord should be D');
	equal(notes[1].octave, 4, '2nd note of the B3 minor chord should be of octave 4');
	equal(notes[1].cents, 0, '2nd note of the B3 minor chord should be');
	equal(notes[1].midi, 62, '2nd note of the B3 minor chord should be midi value 62');

	equal(Math.floor(notes[2].frequency * 1000) / 1000, 369.994, '3rd note of the B3 minor chord should be 369.994hz');
	equal(notes[2].label, 'F#', '3rd note of the B3 minor chord should be F#');
	equal(notes[2].octave, 4, '3rd note of the B3 minor chord should be of octave 4');
	equal(notes[2].cents, 0, '3rd note of the B3 minor chord should be');
	equal(notes[2].midi, 66, '3rd note of the B3 minor chord should be midi value 66');
});

test('chord get interval', function() {
	var chord = Aural.Music.ChordList.getChord('major', 'A');
	var intervals = chord.getIntervals();

	equal(intervals.length, 3, 'there should be 3 intervals in a major chord');

	equal(intervals[0].cents, 0, '1st interval of a major chord should be of 0 cents');
	equal(intervals[1].cents, 400, '2nd interval of a major chord should be of 400 cents');
	equal(intervals[2].cents, 700, '3rd interval of a major chord should be of 700 cents');
	
	chord = Aural.Music.ChordList.getChord('dim7');
	intervals = chord.getIntervals();

	equal(intervals.length, 4, 'there should be 4 intervals in a diminished seventh chord');
	
	equal(intervals[0].cents, 0, '1st interval of a diminished seventh chord should be of 0 cents');
	equal(intervals[1].cents, 300, '2nd interval of a diminished seventh chord should be of 300 cents');
	equal(intervals[2].cents, 600, '3rd interval of a diminished seventh chord should be of 600 cents');
	equal(intervals[3].cents, 900, '4th interval of a diminished seventh chord should be of 900 cents');
});