module("Aural.Music.Scale");

test('scale major', function() {
	var scale = Aural.Music.ScaleList.getScale('major');

	equal(scale.key, 'C', 'default scale key should be C');
	equal(scale.getKeyOffset(), 0, 'default offset should be 0');
	equal(scale.getType(), 'heptatonic', 'major scale should be heptatonic');
	equal(scale.getHemitonicType(), 'hemitonic', 'major scale should be hemitonic');
	equal(scale.getHemitonicType('count'), 'dihemitonic', 'major scale should be dihemitonic');
	equal(scale.getHemitonicType('succession'), 'ancohemitonic', 'major scale should be ancohemitonic');

	equal(scale.getNotesAsLabels().join(','), 'C,D,E,F,G,A,B', 'C major scale should be C,D,E,F,G,A,B');
});

test('scale minor', function() {
	var scale = Aural.Music.ScaleList.getScale('minor');

	equal(scale.key, 'C', 'default scale key should be C');
	equal(scale.getKeyOffset(), 0, 'default offset should be 0');
	equal(scale.getType(), 'heptatonic', 'minor scale should be heptatonic');
	equal(scale.getHemitonicType(), 'hemitonic', 'minor scale should be hemitonic');
	equal(scale.getHemitonicType('count'), 'dihemitonic', 'minor scale should be dihemitonic');
	equal(scale.getHemitonicType('succession'), 'ancohemitonic', 'minor scale should be ancohemitonic');

	equal(scale.getNotesAsLabels().join(','), 'C,D,D#,F,G,G#,A#', 'C minor scale should be C,D,D#,F,G,G#,A#');
});

test('scale ryukyu', function() {
	var scale = Aural.Music.ScaleList.getScale('ryukyu');

	equal(scale.key, 'C', 'default scale key should be C');
	equal(scale.getKeyOffset(), 0, 'default offset should be 0');
	equal(scale.getType(), 'pentatonic', 'ryukyu scale should be pentatonic');
	equal(scale.getHemitonicType(), 'hemitonic', 'ryukyu scale should be hemitonic');
	equal(scale.getHemitonicType('count'), 'dihemitonic', 'ryukyu scale should be dihemitonic');
	equal(scale.getHemitonicType('succession'), 'ancohemitonic', 'ryukyu scale should be ancohemitonic');

	equal(scale.getNotesAsLabels().join(','), 'C,E,F,G,B', 'C ryukyu scale should be C,E,F,G,B');
});

test('scale whole-tone', function() {
	var scale = Aural.Music.ScaleList.getScale('whole-tone');

	equal(scale.key, 'C', 'default scale key should be C');
	equal(scale.getKeyOffset(), 0, 'default offset should be 0');
	equal(scale.getType(), 'hexatonic', 'wholetone scale should be hexatonic');
	equal(scale.getHemitonicType(), 'anhemitonic', 'wholetone scale should be anhemitonic');
	equal(scale.getHemitonicType('count'), 'anhemitonic', 'wholetone scale should be anhemitonic');
	equal(scale.getHemitonicType('succession'), 'anhemitonic', 'wholetone scale should be anhemitonic');

	equal(scale.getNotesAsLabels().join(','), 'C,D,E,F#,G#,A#', 'C whole-tone scale should be C,D,E,F#,G#,A#');
});

test('scale minor bebop', function() {
	var scale = Aural.Music.ScaleList.getScale('minor bebop');

	equal(scale.key, 'C', 'default scale key should be C');
	equal(scale.getKeyOffset(), 0, 'default offset should be 0');
	equal(scale.getType(), 'octatonic', 'minor bebop scale should be octatonic');
	equal(scale.getHemitonicType(), 'hemitonic', 'minor bebop scale should be hemitonic');
	equal(scale.getHemitonicType('count'), 'tetrahemitonic', 'minor bebop scale should be tetrahemitonic');
	equal(scale.getHemitonicType('succession'), 'cohemitonic', 'minor bebop scale should be cohemitonic');

	equal(scale.getNotesAsLabels().join(','), 'C,D,D#,E,F,G,A,A#', 'C minor bebop scale should be C,D,D#,E,F,G,A,A#');
});

test('scale set key', function() {
	var scale = Aural.Music.ScaleList.getScale('major');

	scale.setKey('Ab');

	equal(scale.key, 'G#', 'Ab major scale key should be G#');
	equal(scale.getNotesAsLabels().join(','), 'G#,A#,C,C#,D#,F,G', 'Ab major scale should be G#,A#,C,C#,D#,F,G');

	scale.setKey('E#');

	equal(scale.key, 'F', 'E# major scale key should be F');
	equal(scale.getNotesAsLabels().join(','), 'F,G,A,A#,C,D,E', 'E# major scale should be F,G,A,A#,C,D,E');
});

test('scale transpose', function() {
	var scale = Aural.Music.ScaleList.getScale('major');

	scale.transpose(2);

	equal(scale.key, 'D', 'C+2 major scale key should be D');
	equal(scale.getNotesAsLabels().join(','), 'D,E,F#,G,A,B,C#', 'C+2 major scale should be D,E,F#,G,A,B,C#');

	scale.transpose(-4);

	equal(scale.key, 'A#', 'C-2 major scale key should be A#');
	equal(scale.getNotesAsLabels().join(','), 'A#,C,D,D#,F,G,A', 'C-2 major scale should be A#,C,D,D#,F,G,A');
});

test('scale copy', function() {
	var scale1 = Aural.Music.ScaleList.getScale('major');
	var scale2 = scale1.copy('A#');

	equal(scale1.key, 'C', 'default scale key should be C');
	equal(scale1.getNotesAsLabels().join(','), 'C,D,E,F,G,A,B', 'C major scale should be C,D,E,F,G,A,B');

	equal(scale2.key, 'A#', 'A# major scale key should be A#');
	equal(scale2.getNotesAsLabels().join(','), 'A#,C,D,D#,F,G,A', 'A# major scale should be A#,C,D,D#,F,G,A');
});

test('scale get interval', function() {
	var scale = Aural.Music.ScaleList.getScale('major');

	var intervals = scale.getIntervals();

	equal(intervals.length, 7, 'there should be 7 intervals in a major scale');

	equal(intervals[0].cents, 0, '1st interval of a major scale should be of 0 cents');
	equal(intervals[1].cents, 200, '2nd interval of a major scale  should be of 200 cents');
	equal(intervals[2].cents, 400, '3rd interval of a major scale  should be of 400 cents');
	equal(intervals[3].cents, 500, '4th interval of a major scale  should be of 500 cents');
	equal(intervals[4].cents, 700, '5th interval of a major scale  should be of 700 cents');
	equal(intervals[5].cents, 900, '6th interval of a major scale  should be of 900 cents');
	equal(intervals[6].cents, 1100, '7th interval of a major scale  should be of 1100 cents');

	scale = Aural.Music.ScaleList.getScale('ryukyu');

	intervals = scale.getIntervals();

	equal(intervals.length, 5, 'there should be 5 intervals in a ryukyu scale');

	equal(intervals[0].cents, 0, '1st interval of a ryukyu scale should be of 0 cents');
	equal(intervals[1].cents, 400, '2nd interval of a ryukyu scale should be of 400 cents');
	equal(intervals[2].cents, 500, '3rd interval of a ryukyu scale should be of 500 cents');
	equal(intervals[3].cents, 700, '4th interval of a ryukyu scale should be of 700 cents');
	equal(intervals[4].cents, 1100, '5th interval of a ryukyu scale should be of 1100 cents');
});

test('scale get notes', function() {
	var scale = Aural.Music.ScaleList.getScale('minor penta', 'D');

	var notes = scale.getNotes(3);

	equal(notes.length, 5, 'there should be 5 notes in a minor penta scale octave');

	equal(Math.floor(notes[0].frequency * 1000) / 1000, 73.416, '1st note in 2nd octave of D minor penta scale should be 73.416hz');
	equal(notes[0].label, 'D', '1st note in 2nd octave of D minor penta scale should be D');
	equal(notes[0].octave, 2, '1st note in 2nd octave of D minor penta scale should be of octave 2');
	equal(notes[0].cents, 0, '1st note in 2nd octave of D minor penta scale should be 0cts');
	equal(notes[0].midi, 38, '1st note in 2nd octave of D minor penta scale should be midi value 38');

	equal(Math.floor(notes[1].frequency * 1000) / 1000, 87.307, '2nd note in 2nd octave of D minor penta scale should be 87.307hz');
	equal(notes[1].label, 'F', '2nd note in 2nd octave of D minor penta scale should be F');
	equal(notes[1].octave, 2, '2nd note in 2nd octave of D minor penta scale should be of octave 2');
	equal(notes[1].cents, 0, '2nd note in 2nd octave of D minor penta scale should be 0cts');
	equal(notes[1].midi, 41, '2nd note in 2nd octave of D minor penta scale should be midi value 41');
	
	equal(Math.floor(notes[2].frequency * 1000) / 1000, 97.998, '3rd note in 2nd octave of D minor penta scale should be 97.998hz');
	equal(notes[2].label, 'G', '3rd note in 2nd octave of D minor penta scale should be G');
	equal(notes[2].octave, 2, '3rd note in 2nd octave of D minor penta scale should be of octave 2');
	equal(notes[2].cents, 0, '3rd note in 2nd octave of D minor penta scale should be 0cts');
	equal(notes[2].midi, 43, '3rd note in 2nd octave of D minor penta scale should be midi value 43');
	
	equal(Math.floor(notes[3].frequency * 1000) / 1000, 110, '4th note in 2nd octave of D minor penta scale should be 110hz');
	equal(notes[3].label, 'A', '4th note in 2nd octave of D minor penta scale should be A');
	equal(notes[3].octave, 2, '4th note in 2nd octave of D minor penta scale should be of octave 2');
	equal(notes[3].cents, 0, '4th note in 2nd octave of D minor penta scale should be 0cts');
	equal(notes[3].midi, 45, '4th note in 2nd octave of D minor penta scale should be midi value 45');
	
	equal(Math.floor(notes[4].frequency * 1000) / 1000, 130.812, '5th note in 2nd octave of D minor penta scale should be 130.812hz');
	equal(notes[4].label, 'C', '5th note in 2nd octave of D minor penta scale should be C');
	equal(notes[4].octave, 3, '5th note in 2nd octave of D minor penta scale should be of octave 3');
	equal(notes[4].cents, 0, '5th note in 2nd octave of D minor penta scale should be 0cts');
	equal(notes[4].midi, 48, '5th note in 2nd octave of D minor penta scale should be midi value 48');
});

test('scale contains chords', function() {
	var scale = Aural.Music.ScaleList.getScale('major', 'C#');

	equal(scale.containsChord(Aural.Music.ChordList.getChord('C#')), true);
	equal(scale.containsChord(Aural.Music.ChordList.getChord('C#m')), false);
	equal(scale.containsChord(Aural.Music.ChordList.getChord('C#dim')), false);
	equal(scale.containsChord(Aural.Music.ChordList.getChord('C#7')), true);
	equal(scale.containsChord(Aural.Music.ChordList.getChord('C#M7')), true);
	equal(scale.containsChord(Aural.Music.ChordList.getChord('C#m7')), false);
	
	equal(scale.containsChord(Aural.Music.ChordList.getChord('A#')), false);
	equal(scale.containsChord(Aural.Music.ChordList.getChord('A#m')), true);
	equal(scale.containsChord(Aural.Music.ChordList.getChord('A#dim')), false);
	equal(scale.containsChord(Aural.Music.ChordList.getChord('A#7')), false);
	equal(scale.containsChord(Aural.Music.ChordList.getChord('A#M7')), false);
	equal(scale.containsChord(Aural.Music.ChordList.getChord('A#m7')), true);
});

test('scale get chords', function() {
	var scale1 = Aural.Music.ScaleList.getScale('minor', 'A');
	var scale2 = Aural.Music.ScaleList.getScale('major', 'C');

	var chords1 = scale1.getChords();
	var chords2 = scale2.getChords();

	equal(chords1.length, chords2.length);
});