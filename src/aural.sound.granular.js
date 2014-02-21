"use strict";

Aural.Sound.Granular.Collection = function(source, grainShape, grainLength) {
	this.setSource(source);
	this.grainShape = grainShape;
	
	this.position = 0;
	this.loop = false;
	
	this.grainLength = grainLength;
	this.grainLengthVar = 0;
	
	this.waveSpeed = 1;
	this.waveSpeedVar = 0;
	this.wavePositionOffset = 0;
};

Aural.Sound.Granular.Collection.prototype.setSource = function(source) {
	this.source = source;
	this.start = 0;
	this.end = this.source.length - 1;
};

Aural.Sound.Granular.Collection.prototype.setPosition = function(position) {
	this.position = position % (this.end - this.start);
};

Aural.Sound.Granular.Collection.prototype.getGrainEnveloppe = function() {
	var env;
	
	var lengthVariation = (Math.random() * 2 - 1) * this.grainLengthVar;
	var length = Math.max(1, Math.floor(this.grainLength + lengthVariation));
	
	if(this.previousGrainShape !== this.grainShape || this.previousGrainLength !== length) {
		env = new Aural.Sound.Enveloppe.Fixed(this.grainShape, length);
		this.previousGrainEnveloppe = env;
		this.previousGrainShape = this.grainShape;
		this.previousGrainLength = length;
	} else {
		env = this.previousGrainEnveloppe;
	}
	
	return env;
};

Aural.Sound.Granular.Collection.prototype.getGrain = function() {
	var env = this.getGrainEnveloppe();
	var data = new Float32Array(env.length);
	
	var position = this.position;
	var speed = this.waveSpeed + (Math.random() * 2 - 1) * this.waveSpeedVar;
	
	for(var i = 0, l = env.length; i < l; i++) {
		data[i] = env.getAmplitude(i, true) * this.source.getSample(position, 1);
		position+= speed;
	}
	
	this.position+= this.grainLength * (1 - this.wavePositionOffset);
	//or this.position+= position * (1 - this.wavePositionOffset);
	//or this.position+= env.length * (1 - this.wavePositionOffset);
	
	return new Aural.Sound.Buffer(data);
};

Aural.Sound.Granular.Collection.prototype.source = null;

Aural.Sound.Granular.Collection.prototype.loop = false;
Aural.Sound.Granular.Collection.prototype.start = 0;
Aural.Sound.Granular.Collection.prototype.end = 0;
Aural.Sound.Granular.Collection.prototype.position = 0;

Aural.Sound.Granular.Collection.prototype.grainLength = 0;
Aural.Sound.Granular.Collection.prototype.grainLengthVar = 0;

Aural.Sound.Granular.Collection.prototype.waveSpeed = 0;
Aural.Sound.Granular.Collection.prototype.waveSpeedVar = 0;

Aural.Sound.Granular.Collection.prototype.wavePositionOffset = 0;

//Aural.Sound.Granular.Collection.prototype.positionFollowType = 0;
//Aural.Sound.Granular.Collection.prototype.grainSpacing = 0;
//Aural.Sound.Granular.Collection.prototype.polaritySwitching = false;
//Aural.Sound.Granular.Collection.prototype.currentPolarity = 1;