module("Aural.Sound.Enveloppe.Fixed");

test('empty', function() {
	var env = new Aural.Sound.Enveloppe.Fixed('triangular', 100);
	
	equal(env.length, 100);
	
	equal(env.getAmplitude(0), 0);
	equal(env.getAmplitude(50), 1);
	equal(Math.round(env.getAmplitude(99) * 1000) / 1000, 0.02);
	equal(env.getAmplitude(100), 0);
	
	equal(env.getAmplitude(-50), 0);
	equal(env.getAmplitude(150), 0);
});

test('empty', function() {
	var env = new Aural.Sound.Enveloppe.Fixed('rectangular', 100);
	
	equal(env.length, 100);
	
	equal(env.getAmplitude(0), 1);
	equal(env.getAmplitude(50), 1);
	equal(env.getAmplitude(99), 1);
	equal(env.getAmplitude(100), 0);
	
	equal(env.getAmplitude(-50), 0);
	equal(env.getAmplitude(150), 0);
});

test('rampup', function() {
	var env = new Aural.Sound.Enveloppe.Fixed('rampup', 50);
	
	equal(env.length, 50);
	
	equal(env.getAmplitude(0), 0);
	equal(env.getAmplitude(49), 1);
	equal(env.getAmplitude(50), 0);
	
	equal(env.getAmplitude(-50), 0);
	equal(env.getAmplitude(150), 0);
});

test('rampdown', function() {
	var env = new Aural.Sound.Enveloppe.Fixed('rampdown', 50, 2);
	
	equal(env.length, 50);
	
	equal(env.getAmplitude(0), 1);
	equal(env.getAmplitude(49), 0);
	equal(env.getAmplitude(50), 0);
	
	equal(env.getAmplitude(-50), 0);
	equal(env.getAmplitude(150), 0);
});
