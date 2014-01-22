module("Aural.Music.Scalelist");

test('addScale', function() {
	Aural.Music.ScaleList.addScale([1,2,1,2,1,2,3], ['Custom scale']);

	var scale = Aural.Music.ScaleList.getScale('Custom scale', 'C');
	
	equal(scale.titles[0], 'Custom scale');
	equal(scale.key, 'C');
	
	var received = scale.getNotesAsLabels();
	var expected = ['C', 'C#', 'D#', 'E', 'F#', 'G', 'A'];
	
	equal(received.length, 7);
	
	for(var l = received.length; l--;) {
		equal(received[l], expected[l]);
	}
});

test('similarScales', function() {
	var scale = Aural.Music.ScaleList.getScale('major', 'C');
	
	var scales = Aural.Music.ScaleList.getSimilarScales(scale);
	
	expect(scales.length + 3);
	
	equal(scales.length > 0, true);
	
	for(var i = 0, l = scales.length; i < l; i++) {
		equal(scales[i].intervals.length >= 7, true);
		
		switch(scales[i].titles[0]) {
			case 'major bebop':
				equal(scales[i].key, 'C');
				break;
			case 'aeolian':
				equal(scales[i].key, 'A');
				break;
		}
	}
});

test('similarScales exact', function() {
	var scale = Aural.Music.ScaleList.getScale('minor', 'A');
	
	var scales = Aural.Music.ScaleList.getSimilarScales(scale, true);
	
	expect(scales.length + 2);
	
	equal(scales.length > 0, true);
	
	for(var i = 0, l = scales.length; i < l; i++) {
		equal(scales[i].intervals.length, 7);
		
		if(scales[i].titles[0] == 'ionian') {
			equal(scales[i].key, 'C');
		}
	}
});

/*
test('scale get contained scale', function() {
	var scale = Aural.Music.ScaleList.getScale('minor', 'A');
	
	console.log(Aural.Music.ScaleList.getContainedScales(scale));
});
*/