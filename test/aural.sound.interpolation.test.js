module("Aural.Sound.Interpolation");

test('crude array', function() {
	var array = [];
	equal(Aural.Sound.Interpolation.crude(1, array), 0);

	array = [2];
	equal(Aural.Sound.Interpolation.crude(0, array), 2);
	equal(Aural.Sound.Interpolation.crude(1.5, array), 2);
	equal(Aural.Sound.Interpolation.crude(1, array), 2);
	equal(Aural.Sound.Interpolation.crude(-2.5, array), 2);

	array = [1, 2];
	equal(Aural.Sound.Interpolation.crude(0, array), 1);
	equal(Aural.Sound.Interpolation.crude(1, array), 2);
	equal(Aural.Sound.Interpolation.crude(-1, array), 2);
	equal(Aural.Sound.Interpolation.crude(2, array), 1);
	equal(Aural.Sound.Interpolation.crude(-2, array), 1);

	equal(Aural.Sound.Interpolation.crude(0.2, array), 1);
	equal(Aural.Sound.Interpolation.crude(0.8, array), 2);
	equal(Aural.Sound.Interpolation.crude(-0.2, array), 1);
	equal(Aural.Sound.Interpolation.crude(-0.8, array), 2);
});

test('linear array', function() {
	var array = [];
	equal(Aural.Sound.Interpolation.linear(1, array), 0);

	array = [2];
	equal(Aural.Sound.Interpolation.linear(0, array), 2);
	equal(Aural.Sound.Interpolation.linear(1.5, array), 2);
	equal(Aural.Sound.Interpolation.linear(1, array), 2);
	equal(Aural.Sound.Interpolation.linear(-2.5, array), 2);

	array = [1, 2];
	equal(Aural.Sound.Interpolation.linear(0, array), 1);
	equal(Aural.Sound.Interpolation.linear(1, array), 2);
	equal(Aural.Sound.Interpolation.linear(-1, array), 2);
	equal(Aural.Sound.Interpolation.linear(2, array), 1);
	equal(Aural.Sound.Interpolation.linear(-2, array), 1);

	equal(Math.round(Aural.Sound.Interpolation.linear(0.2, array) * 1000) / 1000, 1.2);
	equal(Math.round(Aural.Sound.Interpolation.linear(0.8, array) * 1000) / 1000, 1.8);
	equal(Math.round(Aural.Sound.Interpolation.linear(-0.2, array) * 1000) / 1000, 1.2);
	equal(Math.round(Aural.Sound.Interpolation.linear(-0.8, array) * 1000) / 1000, 1.8);
});

test('cosine array', function() {
	var array = [];
	equal(Aural.Sound.Interpolation.cosine(1, array), 0);

	array = [2];
	equal(Aural.Sound.Interpolation.cosine(0, array), 2);
	equal(Aural.Sound.Interpolation.cosine(1.5, array), 2);
	equal(Aural.Sound.Interpolation.cosine(1, array), 2);
	equal(Aural.Sound.Interpolation.cosine(-2.5, array), 2);

	array = [1, 2];
	equal(Aural.Sound.Interpolation.cosine(0, array), 1);
	equal(Aural.Sound.Interpolation.cosine(1, array), 2);
	equal(Aural.Sound.Interpolation.cosine(-1, array), 2);
	equal(Aural.Sound.Interpolation.cosine(2, array), 1);
	equal(Aural.Sound.Interpolation.cosine(-2, array), 1);

	equal(Math.round(Aural.Sound.Interpolation.cosine(0.2, array) * 1000) / 1000, 1.095);
	equal(Math.round(Aural.Sound.Interpolation.cosine(0.8, array) * 1000) / 1000, 1.905);
	equal(Math.round(Aural.Sound.Interpolation.cosine(-0.2, array) * 1000) / 1000, 1.095);
	equal(Math.round(Aural.Sound.Interpolation.cosine(-0.8, array) * 1000) / 1000, 1.905);
});

test('crude bufferarray', function() {
	var array = new Uint16Array(0);
	equal(Aural.Sound.Interpolation.crude(1, array), 0);

	array = new Float32Array([2]);
	equal(Aural.Sound.Interpolation.crude(0, array), 2);
	equal(Aural.Sound.Interpolation.crude(1.5, array), 2);
	equal(Aural.Sound.Interpolation.crude(1, array), 2);
	equal(Aural.Sound.Interpolation.crude(-2.5, array), 2);

	array = new Int8Array([1, 2]);
	equal(Aural.Sound.Interpolation.crude(0, array), 1);
	equal(Aural.Sound.Interpolation.crude(1, array), 2);
	equal(Aural.Sound.Interpolation.crude(-1, array), 2);
	equal(Aural.Sound.Interpolation.crude(2, array), 1);
	equal(Aural.Sound.Interpolation.crude(-2, array), 1);

	equal(Aural.Sound.Interpolation.crude(0.2, array), 1);
	equal(Aural.Sound.Interpolation.crude(0.8, array), 2);
	equal(Aural.Sound.Interpolation.crude(-0.2, array), 1);
	equal(Aural.Sound.Interpolation.crude(-0.8, array), 2);
});

test('linear bufferarray', function() {
	var array = new Uint16Array(0);
	equal(Aural.Sound.Interpolation.linear(1, array), 0);

	array = new Float32Array([2]);
	equal(Aural.Sound.Interpolation.linear(0, array), 2);
	equal(Aural.Sound.Interpolation.linear(1.5, array), 2);
	equal(Aural.Sound.Interpolation.linear(1, array), 2);
	equal(Aural.Sound.Interpolation.linear(-2.5, array), 2);

	array = new Int8Array([1, 2]);
	equal(Aural.Sound.Interpolation.linear(0, array), 1);
	equal(Aural.Sound.Interpolation.linear(1, array), 2);
	equal(Aural.Sound.Interpolation.linear(-1, array), 2);
	equal(Aural.Sound.Interpolation.linear(2, array), 1);
	equal(Aural.Sound.Interpolation.linear(-2, array), 1);

	equal(Math.round(Aural.Sound.Interpolation.linear(0.2, array) * 1000) / 1000, 1.2);
	equal(Math.round(Aural.Sound.Interpolation.linear(0.8, array) * 1000) / 1000, 1.8);
	equal(Math.round(Aural.Sound.Interpolation.linear(-0.2, array) * 1000) / 1000, 1.2);
	equal(Math.round(Aural.Sound.Interpolation.linear(-0.8, array) * 1000) / 1000, 1.8);
});

test('cosine bufferarray', function() {
	var array = new Uint16Array(0);
	equal(Aural.Sound.Interpolation.cosine(1, array), 0);

	array = new Float32Array([2]);
	equal(Aural.Sound.Interpolation.cosine(0, array), 2);
	equal(Aural.Sound.Interpolation.cosine(1.5, array), 2);
	equal(Aural.Sound.Interpolation.cosine(1, array), 2);
	equal(Aural.Sound.Interpolation.cosine(-2.5, array), 2);

	array = new Int8Array([1, 2]);
	equal(Aural.Sound.Interpolation.cosine(0, array), 1);
	equal(Aural.Sound.Interpolation.cosine(1, array), 2);
	equal(Aural.Sound.Interpolation.cosine(-1, array), 2);
	equal(Aural.Sound.Interpolation.cosine(2, array), 1);
	equal(Aural.Sound.Interpolation.cosine(-2, array), 1);

	equal(Math.round(Aural.Sound.Interpolation.cosine(0.2, array) * 1000) / 1000, 1.095);
	equal(Math.round(Aural.Sound.Interpolation.cosine(0.8, array) * 1000) / 1000, 1.905);
	equal(Math.round(Aural.Sound.Interpolation.cosine(-0.2, array) * 1000) / 1000, 1.095);
	equal(Math.round(Aural.Sound.Interpolation.cosine(-0.8, array) * 1000) / 1000, 1.905);
});