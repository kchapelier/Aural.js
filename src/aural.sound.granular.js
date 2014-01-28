"use strict";

Aural.Sound.Granular.Collection = function(audio, grainShape, grainLength) {
	this.audio = audio;
	this.grainShape = grainShape;
	
	this.position = 0;
	this.start = 0;
	this.end = this.audio.length - 1;
	this.loop = false;
	
	this.grainLength = grainLength;
	this.grainLengthVar = 0;
	
	this.waveSpeed = 1;
	this.waveSpeedVar = 0;
	this.wavePositionOffset = 0;
	
	//console.log(this);
};

Aural.Sound.Granular.Collection.prototype.setPosition = function(position) {
	this.position = position % (this.end - this.start);
};

Aural.Sound.Granular.Collection.prototype.getGrainEnveloppe = function() {
	var env;
	
	if(this.previousGrainShape !== this.grainShape || this.previousGrainLength !== this.grainLength) {
		env = new Aural.Sound.Enveloppe.Fixed(this.grainShape, this.grainLength);
		this.previousGrainEnveloppe = env;
		this.previousGrainShape = this.grainShape;
		this.previousGrainLength = this.grainLength;
	} else {
		env = this.previousGrainEnveloppe;
	}
	
	return env;
};

Aural.Sound.Granular.Collection.prototype.getGrain = function() {
	var length = Math.floor(this.grainLength + (Math.random() * 2 - 1) * this.grainLengthVar);
	length = Math.max(1, length);
	var data = new Float32Array(length);
	
	//var speedEnv = new Aural.Sound.Enveloppe.Fixed('hannwindow:2', length);
	
	var env = this.getGrainEnveloppe();
	
	var position = this.position;
	var speed = this.waveSpeed + (Math.random() * 2 - 1) * this.waveSpeedVar;
	for(var i = 0, l = this.grainLength; i < l; i++) {
		data[i] = env.getAmplitude(i, true) * this.audio.getSample(position, 1);
		position+= speed;// + (speedEnv.getAmplitude(i) * -0.);
	}
	
	//this.position+= position;
	this.position+= this.grainLength;
	
	this.position-= this.grainLength * this.wavePositionOffset / 10000;
	
	return new Aural.Sound.Buffer(data);
};

Aural.Sound.Granular.Collection.prototype.audio = null;

Aural.Sound.Granular.Collection.prototype.loop = false;
Aural.Sound.Granular.Collection.prototype.start = 0;
Aural.Sound.Granular.Collection.prototype.end = 0;
Aural.Sound.Granular.Collection.prototype.position = 0;

Aural.Sound.Granular.Collection.prototype.grainLength = 0;
Aural.Sound.Granular.Collection.prototype.grainLengthVar = 0;

Aural.Sound.Granular.Collection.prototype.waveSpeed = 0;
Aural.Sound.Granular.Collection.prototype.waveSpeedVar = 0;

Aural.Sound.Granular.Collection.prototype.wavePositionOffset = 0;

//Aural.Sound.Granular.Collection.prototype.grainSpacing = 0;