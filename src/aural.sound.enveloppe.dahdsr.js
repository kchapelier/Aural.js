"use strict";

Aural.Sound.Enveloppe.DAHDSR = function() {
	this.process();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.delay = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.attack = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.attackLogBias = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.hold = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.decay = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.decayLogBias = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.sustain = 1;
Aural.Sound.Enveloppe.DAHDSR.prototype.release = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.releaseLogBias = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.inverted = false;

Aural.Sound.Enveloppe.DAHDSR.prototype.setDelay = function(delay) {
	this.delay = Math.max(0, delay);
	this.processDAHD();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setAttack = function(attack) {
	this.attack = Math.max(0, attack);
	this.processDAHD();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setAttackLogBias = function(attackLogBias) {
	this.attackLogBias = attackLogBias;
	this.processDAHD();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setHold = function(hold) {
	this.hold = Math.max(0, hold);
	this.processDAHD();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setDecay = function(decay) {
	this.decay = Math.max(0, decay);
	this.processDAHD();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setDecayLogBias = function(decayLogBias) {
	this.decayLogBias = decayLogBias;
	this.processDAHD();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setSustain = function(sustain) {
	this.sustain = Math.min(1, Math.max(0, sustain));
	this.processDAHD();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setRelease = function(release) {
	this.release = Math.max(0, release);
	this.processR();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setReleaseLogBias = function(releaseLogBias) {
	this.releaseLogBias = releaseLogBias;
	this.processR();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.getAmplitude = function(sample, releaseSample, normalized) {
	var amplitude;

	if(releaseSample && sample > releaseSample) {
		var base = this.getAmplitude(releaseSample, null, normalized);
		sample = sample - releaseSample;

		amplitude = base * Aural.Sound.Interpolation.linear(sample, this.processedShapeR);
	} else {
		if(sample >= this.processedShapeDAHD.length) {
			amplitude = this.sustain;
		} else {
			amplitude = Aural.Sound.Interpolation.linear(sample, this.processedShapeDAHD);
		}
	}

	return amplitude;
};

Aural.Sound.Enveloppe.DAHDSR.prototype.process = function() {
	this.processDAHD();
	this.processR();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.processDAHD = function() {
	console.log(this.delay + this.attack + this.hold + this.decay);
	var processedShape = new Float32Array(this.delay + this.attack + this.hold + this.decay),
		t = 0,
		i;

	for(i = 0; i < this.delay; i++, t++) {
		processedShape[t] = 0;
	}

	for(i = 0; i < this.attack; i++, t++) {
		processedShape[t] = i / this.attack; //TODO take log bias in account
	}

	for(i = 0; i < this.hold; i++, t++) {
		processedShape[t] = 1;
	}

	for(i = 0; i < this.decay; i++, t++) {
		processedShape[t] = this.sustain + (1 - i / this.decay) * (1 - this.sustain); //TODO take log bias in account
	}

	this.processedShapeDAHD = processedShape;
};

Aural.Sound.Enveloppe.DAHDSR.prototype.processR = function() {
	var processedShape = new Float32Array(this.release);

	for(var i = 0; i < this.release; i++) {
		processedShape[i] = 1 - i / this.release; //TODO take log bias in account
	}

	this.processedShapeR = processedShape;
};