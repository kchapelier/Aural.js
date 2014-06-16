module("Aural.Sound.Enveloppe.DAHDSR");

test('default enveloppe', function() {
	var env = new Aural.Sound.Enveloppe.DAHDSR();

	equal(env.getAmplitude(0), 1);
	equal(env.getAmplitude(100), 1);
	equal(env.getAmplitude(100, 100), 0);
	equal(env.getAmplitude(100, 200), 1);
	equal(env.getAmplitude(200, 100), 0);
});

test('simple adsr', function() {
	var env = new Aural.Sound.Enveloppe.DAHDSR();
	env.setAttack(100);
	env.setDecay(100);
	env.setSustain(0.5);
	env.setRelease(100);

	equal(env.getAmplitude(0), 0);
	equal(env.getAmplitude(50), 0.5);
	equal(env.getAmplitude(100), 1);
	equal(env.getAmplitude(150), 0.75);
	equal(env.getAmplitude(200), 0.5);
	equal(env.getAmplitude(500), 0.5);
	equal(env.getAmplitude(500, 1000), 0.5);
	equal(env.getAmplitude(1000, 1000), 0.5);
	equal(env.getAmplitude(1050, 1000), 0.25);
	equal(env.getAmplitude(1100, 1000), 0);
	equal(env.getAmplitude(1250, 1000), 0);
});

test('delay and hold only', function() {
	var env = new Aural.Sound.Enveloppe.DAHDSR();
	env.setDelay(100);
	env.setHold(100);
	env.setSustain(0);

	equal(env.getAmplitude(0), 0);
	equal(env.getAmplitude(50), 0);
	equal(env.getAmplitude(100), 1);
	equal(env.getAmplitude(199), 1);
	equal(env.getAmplitude(200), 0);
	equal(env.getAmplitude(150, 100), 0);
});

test('full dahdsr', function() {
	var env = new Aural.Sound.Enveloppe.DAHDSR();
	env.setDelay(100);
	env.setAttack(100);
	env.setHold(100);
	env.setDecay(100);
	env.setSustain(0.5);
	env.setRelease(100);

	equal(Math.round(env.getAmplitude(70) * 1000) / 1000, 0);
	equal(Math.round(env.getAmplitude(170) * 1000) / 1000, 0.7);
	equal(Math.round(env.getAmplitude(270) * 1000) / 1000, 1);
	equal(Math.round(env.getAmplitude(370) * 1000) / 1000, 0.65);
	equal(Math.round(env.getAmplitude(500) * 1000) / 1000, 0.5);
	equal(Math.round(env.getAmplitude(570, 500) * 1000) / 1000, 0.15);

	equal(Math.round(env.getAmplitude(270, 200) * 1000) / 1000, 0.3);
});

test('full inverted dahdsr', function() {
	var env = new Aural.Sound.Enveloppe.DAHDSR();
	env.setDelay(100);
	env.setAttack(100);
	env.setHold(100);
	env.setDecay(100);
	env.setSustain(0.5);
	env.setRelease(100);
	env.setInverted(true);

	equal(Math.round(env.getAmplitude(70) * 1000) / 1000, 1);
	equal(Math.round(env.getAmplitude(170) * 1000) / 1000, 0.3);
	equal(Math.round(env.getAmplitude(270) * 1000) / 1000, 0);
	equal(Math.round(env.getAmplitude(370) * 1000) / 1000, 0.35);
	equal(Math.round(env.getAmplitude(500) * 1000) / 1000, 0.5);
	equal(Math.round(env.getAmplitude(570, 500) * 1000) / 1000, 0.15);

	equal(Math.round(env.getAmplitude(270, 200) * 1000) / 1000, 0);
});