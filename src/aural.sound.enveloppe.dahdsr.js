"use strict";

//TODO implement setProperties and usual options
//TODO implement all log/expBias
//TODO implement the hold absolute option

Aural.Sound.Enveloppe.DAHDSR = function(options) {

	if(options) {
		this.setProperties(options);
	}

	this.process();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setProperties = function(properties) {
	for(var key in properties) {
		if(properties.hasOwnProperty(key)) {
			this.setProperty(key, properties[key]);
		}
	}
};

Aural.Sound.Enveloppe.DAHDSR.prototype.delay = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.attack = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.attackLogBias = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.hold = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.holdAbsolute = false;
Aural.Sound.Enveloppe.DAHDSR.prototype.decay = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.decayLogBias = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.sustain = 1;
Aural.Sound.Enveloppe.DAHDSR.prototype.release = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.releaseLogBias = 0;
Aural.Sound.Enveloppe.DAHDSR.prototype.inverted = false;

Aural.Sound.Enveloppe.DAHDSR.prototype.processedShapeStart = null;
Aural.Sound.Enveloppe.DAHDSR.prototype.processedShapeEnd = null;

Aural.Sound.Enveloppe.DAHDSR.prototype.setProperty = function(property, value) {

};

Aural.Sound.Enveloppe.DAHDSR.prototype.setDelay = function(delay) {
	this.delay = Math.max(0, delay);
	this.processStart();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setAttack = function(attack) {
	this.attack = Math.max(0, attack);
	this.processStart();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setAttackLogBias = function(attackLogBias) {
	this.attackLogBias = attackLogBias;
	this.processStart();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setHold = function(hold) {
	this.hold = Math.max(0, hold);
	this.processStart();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setHoldAbsolute = function(holdAbsolute) {
	this.holdAbsolute = !!holdAbsolute;
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setDecay = function(decay) {
	this.decay = Math.max(0, decay);
	this.processStart();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setDecayLogBias = function(decayLogBias) {
	this.decayLogBias = decayLogBias;
	this.processStart();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setSustain = function(sustain) {
	this.sustain = Math.min(1, Math.max(0, sustain));
	this.processStart();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setRelease = function(release) {
	this.release = Math.max(0, release);
	this.processEnd();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setReleaseLogBias = function(releaseLogBias) {
	this.releaseLogBias = releaseLogBias;
	this.processEnd();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.setInverted = function(inverted) {
	this.inverted = !!inverted;
};

Aural.Sound.Enveloppe.DAHDSR.prototype.getAmplitude = function(sample, releaseSample, normalized) {
	var amplitude;

	if(releaseSample && sample >= releaseSample) {
		sample = sample - releaseSample;

		if(sample >= this.processedShapeEnd.length) {
			return 0;
		} else {
			var base = this.getAmplitude(releaseSample, null, normalized);
			amplitude = base * Aural.Sound.Interpolation.linear(sample, this.processedShapeEnd);
		}
	} else {
		if(sample >= this.processedShapeStart.length) {
			amplitude = this.sustain;
		} else {
			amplitude = Aural.Sound.Interpolation.linear(sample, this.processedShapeStart);
		}

		if(this.inverted) {
			amplitude = 1 - amplitude;
		}
	}

	return amplitude;
};

Aural.Sound.Enveloppe.DAHDSR.prototype.process = function() {
	this.processStart();
	this.processEnd();
};

Aural.Sound.Enveloppe.DAHDSR.prototype.processStart = function() {
	var processedShape = new Float32Array(this.delay + this.attack + this.hold + this.decay),
		t = 0,
		i;

	for(i = 0; i < this.delay; i++, t++) {
		processedShape[t] = 0;
	}

	for(i = 0; i < this.attack; i++, t++) {
		processedShape[t] = i / this.attack;
	}

	for(i = 0; i < this.hold; i++, t++) {
		processedShape[t] = 1;
	}

	for(i = 0; i < this.decay; i++, t++) {
		processedShape[t] = this.sustain + (1 - i / this.decay) * (1 - this.sustain);
	}

	this.processedShapeStart = processedShape;
};

Aural.Sound.Enveloppe.DAHDSR.prototype.processEnd = function() {
	var processedShape = new Float32Array(this.release);

	for(var i = 0; i < this.release; i++) {
		processedShape[i] = 1 - i / this.release;
	}

	this.processedShapeEnd = processedShape;
};