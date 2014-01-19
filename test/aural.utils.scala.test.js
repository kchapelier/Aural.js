module("Aural.Utils.Scala");

test('1/4-comma meantone scale', function() {
	var scala = [
		'! meanquar.scl',
		'!',
		'	1/4-comma meantone scale. Pietro Aaron\'s temperament (1523)',
		'12',
		'!',
		'	76.04900',
		'193.15686',
		'310.26471',
		'5/4',
		'503.42157',
		'579.47057',
		'696.57843',
		'25/16',
		'889.73529',
		'1006.84314',
		'1082.89214',
		'2'
	].join('\n');

	var file = new Aural.Utils.Scala.File(scala);
	
	equal(file.description, '1/4-comma meantone scale. Pietro Aaron\'s temperament (1523)');
	equal(file.numberValues, 12);
	equal(file.intervals.length, 12);

	var expectedIntervals = [
		76.049,
		193.15686,
		310.26471,
		386.3137138648348,
		503.42157,
		579.47057,
		696.57843,
		772.6274277296696,
		889.73529,
		1006.84314,
		1082.89214,
		1200
	];

	for(var i = 0, l = expectedIntervals.length; i < l; i++) {
		equal(expectedIntervals[i], file.intervals[i]);
	}
});

test('12-tone Pythagorean scale', function() {
	var scala = [
		'! pyth_12.scl',
		'!',
		'	12-tone Pythagorean scale',
		'12',
		'!',
		'	2187/2048',
		'9/8',
		'32/27',
		'81/64',
		'4/3',
		'729/512',
		'3/2',
		'6561/4096',
		'27/16',
		'16/9',
		'243/128',
		'2/1'
	].join('\r\n');

	var file = new Aural.Utils.Scala.File(scala);

	equal(file.description, '12-tone Pythagorean scale');
	equal(file.numberValues, 12);
	equal(file.intervals.length, 12);

	var expectedIntervals = [
		113.68500605771193,
		203.91000173077487,
		294.13499740383764,
		407.82000346154973,
		498.04499913461245,
		611.7300051923245,
		701.9550008653874,
		815.6400069230995,
		905.8650025961624,
		996.0899982692251,
		1109.775004326937,
		1200
	];

	for(var i = 0, l = expectedIntervals.length; i < l; i++) {
		equal(expectedIntervals[i], file.intervals[i]);
	}
});

test('Siamese Tuning', function() {
	var scala = [
		'! siamese.scl',
		'!',
		'Siamese Tuning, after Clem Fortuna\'s Microtonal Guide',
		' 12',
		'!',
		' 49.800',
		' 172.000',
		'! comment for fun',
		' 215.000',
		' 344.000',
		' 515.000',
		' 564.800',
		' 685.800',
		' 735.800',
		' 857.800',
		' 914.800',
		' 1028.800',
		' 2/1 perfect octave'
	].join('\r\n');

	var file = new Aural.Utils.Scala.File(scala);

	equal(file.description, 'Siamese Tuning, after Clem Fortuna\'s Microtonal Guide');
	equal(file.numberValues, 12);
	equal(file.intervals.length, 12);

	var expectedIntervals = [
		49.8,
		172,
		215,
		344,
		515,
		564.8,
		685.8,
		735.8,
		857.8,
		914.8,
		1028.8,
		1200
	];

	for(var i = 0, l = expectedIntervals.length; i < l; i++) {
		equal(expectedIntervals[i], file.intervals[i]);
	}
});