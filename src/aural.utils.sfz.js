"use strict";

Aural.Utils.Sfz = {
	Region : null,
	File : null
};


Aural.Utils.Sfz.Region = function() {
	this.innerSequence = 1;
};

Aural.Utils.Sfz.Region.prototype.sample = null;

Aural.Utils.Sfz.Region.prototype.volume = 0;
Aural.Utils.Sfz.Region.prototype.pan = 0;
Aural.Utils.Sfz.Region.prototype.transpose = 0;
Aural.Utils.Sfz.Region.prototype.tune = 0;
Aural.Utils.Sfz.Region.prototype.picth_keycenter = 60;
Aural.Utils.Sfz.Region.prototype.lokey = 0;
Aural.Utils.Sfz.Region.prototype.hikey = 127;
Aural.Utils.Sfz.Region.prototype.lorand = 0;
Aural.Utils.Sfz.Region.prototype.hirand = 1;
Aural.Utils.Sfz.Region.prototype.lovel = 0;
Aural.Utils.Sfz.Region.prototype.hivel = 127;
Aural.Utils.Sfz.Region.prototype.lobpm = 0;
Aural.Utils.Sfz.Region.prototype.hibpm = 500;
Aural.Utils.Sfz.Region.prototype.seq_length = 1;
Aural.Utils.Sfz.Region.prototype.seq_position = 1;
Aural.Utils.Sfz.Region.prototype.offset = 0;
Aural.Utils.Sfz.Region.prototype.end = 0;

Aural.Utils.Sfz.Region.prototype.setProperties = function(properties) {
	for(var key in properties) {
		this.setProperty(key, properties[key]);
	}
};

Aural.Utils.Sfz.Region.prototype.setProperty = function(property, value) {
	switch(property) {
		case 'sample':
			this.sample = value; break;
		case 'key':
			this.setProperty('lokey', parseInt(value, 10));
			this.setProperty('hikey', parseInt(value, 10));
			this.setProperty('picth_keycenter', parseInt(value, 10));
			break;
		case 'lokey':
			this.lokey = Math.min(127, Math.max(0, value)); break;
		case 'hikey':
			this.hikey = Math.min(127, Math.max(0, value)); break;
		case 'lovel':
			this.lovel = Math.min(127, Math.max(0, value)); break;
		case 'hivel':
			this.hivel = Math.min(127, Math.max(0, value)); break;
		case 'lorand':
			this.lorand = Math.min(1, Math.max(0, value)); break;
		case 'hirand':
			this.hirand = Math.min(1, Math.max(0, value)); break;
		case 'lobpm':
			this.lobpm = Math.min(500, Math.max(0, value)); break;
		case 'hirand':
			this.hibpm = Math.min(500, Math.max(0, value)); break;
		case 'seq_length':
			this.seq_length = Math.min(100, Math.max(1, value)); break;
		case 'seq_position':
			this.seq_position = Math.min(100, Math.max(1, value)); break;
		case 'picth_keycenter':
			this.picth_keycenter = parseInt(value, 10); break;
		case 'volume':
			this.volume = Math.min(6, Math.max(-144, value)); break;
		case 'pan':
			this.volume = Math.min(100, Math.max(-100, value)); break;
		case 'offset':
			this.offset = Math.max(0, value); break;
		case 'end':
			this.end = Math.max(-1, value); break;
		case 'transpose':
			this.transpose = Math.min(127, Math.max(-127, value)); break;
		case 'tune':
			this.tune = Math.min(100, Math.max(1, value)); break;
		case 'pitch_keycenter':
			this.pitch_keycenter = Math.min(127, Math.max(-127, value)); break;
		default:
			break;
	}
};

/*
Aural.Utils.Sfz.Region.prototype.matchNote = function(key, cents, velocity, bpm, rand) {
	this.innerSequence++;
	
	if(this.innerSequence > this.seq_length) {
		this.innerSequence = 1;
	}
	
	return (
		key >= this.lokey && this.key <= this.hikey &&
		velocity >= this.lovel && velocity <= this.hivel && //velocity layer
		rand >= this.lorand && this.hirand && //round robin
		bpm >= this.lobpm && bpm <= this.hibpm &&
		this.innerSequence == this.seq_position
	);
};
*/

Aural.Utils.Sfz.File = function() {
	this.regions = [];
};

Aural.Utils.Sfz.File.prototype.regions = null;

Aural.Utils.Sfz.File.prototype.addRegion = function(groupOptions, regionOptions) {
	var region = new Aural.Utils.Sfz.Region();
	region.setProperties(groupOptions);
	region.setProperties(regionOptions);
	this.regions.push(region);
};

Aural.Utils.Sfz.File.prototype.parse = function(data){
	//console.log(data);

	var definitions = data.split(/(<group>|<region>)/i);

	var groupOptions = {};
	var regionOptions = {};
	var inGroup = false;
	var inRegion = false;
	var createRegion = false;

	this.regions = [];
	
	for(var i = 0, l = definitions.length; i < l; i++) {
		var definition = definitions[i];

		if(definition == '<group>') {
			inGroup = true;
			inRegion = false;
			groupOptions = {};
			continue;
		}
		
		if(definition == '<region>') {
			inGroup = false;
			inRegion = true;
			regionOptions = {};
			continue;
		}
		
		if(inGroup || inRegion) {
			var lines = definition.split(/[\r\n]/);
			var options = {};
			for(var i2 = 0, l2 = lines.length; i2 < l2; i2++) {
				var line = lines[i2];
				line = line.split('//')[0];

				var option = null;
				var regex = /([a-zA-Z-_]*)=([^ ]*)/g;
				while((option = regex.exec(line)) !== null) {
					options[option[1]] = option[2];
				}
			}

			if(inGroup) {
				groupOptions = options;
			} else {
				regionOptions = options;
			}
		}

		if(inRegion) {
			this.addRegion(groupOptions, regionOptions);
		}
	}
};

Aural.Utils.Sfz.File.loadFromString = function(string) {
	var file = new Aural.Utils.Sfz.File();
	file.parse(string);
	return file;
};