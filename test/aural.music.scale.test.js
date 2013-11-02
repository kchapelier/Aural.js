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

//TODO : test get intervals
//TODO : test setKey
//TODO : test getNotes()
//TODO : test transpose
//TODO : test copy
