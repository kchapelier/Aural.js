"use strict";

Aural.Utils.Sfz.Region = function() {
	this.innerSequence = 0;
};

Aural.Utils.Sfz.Region.prototype.audioBuffer = null;
Aural.Utils.Sfz.Region.prototype.innerSequence = 0;

Aural.Utils.Sfz.Region.prototype.sample = null;
Aural.Utils.Sfz.Region.prototype.volume = 0;
Aural.Utils.Sfz.Region.prototype.pan = 0;
Aural.Utils.Sfz.Region.prototype.transpose = 0;
Aural.Utils.Sfz.Region.prototype.tune = 0;
Aural.Utils.Sfz.Region.prototype.pitchKeyCenter = 60;
Aural.Utils.Sfz.Region.prototype.pitchKeyTrack = 100;
Aural.Utils.Sfz.Region.prototype.pitchRandom = 0;
Aural.Utils.Sfz.Region.prototype.loChannel = 0;
Aural.Utils.Sfz.Region.prototype.hiChannel = 16;
Aural.Utils.Sfz.Region.prototype.loKey = 0;
Aural.Utils.Sfz.Region.prototype.hiKey = 127;
Aural.Utils.Sfz.Region.prototype.loRand = 0;
Aural.Utils.Sfz.Region.prototype.hiRand = 1;
Aural.Utils.Sfz.Region.prototype.loVelocity = 0;
Aural.Utils.Sfz.Region.prototype.hiVelocity = 127;
Aural.Utils.Sfz.Region.prototype.loBpm = 0;
Aural.Utils.Sfz.Region.prototype.hiBpm = 500;
Aural.Utils.Sfz.Region.prototype.sequenceLength = 1;
Aural.Utils.Sfz.Region.prototype.sequencePosition = 1;
Aural.Utils.Sfz.Region.prototype.offset = 0;
Aural.Utils.Sfz.Region.prototype.offsetRandom = 0;
Aural.Utils.Sfz.Region.prototype.end = 0;
Aural.Utils.Sfz.Region.prototype.switchLast = 0;
Aural.Utils.Sfz.Region.prototype.switchLoKey = 0;
Aural.Utils.Sfz.Region.prototype.switchHiKey = 127;
Aural.Utils.Sfz.Region.prototype.switchDown = 0;
Aural.Utils.Sfz.Region.prototype.switchUp = 0;
Aural.Utils.Sfz.Region.prototype.switchPrevious = null;

/**
 * Set several properties of the regions
 * @param {Object} properties - Object containing the options
 */
Aural.Utils.Sfz.Region.prototype.setProperties = function(properties) {
	for(var key in properties) {
		if(properties.hasOwnProperty(key)) {
			this.setProperty(key, properties[key]);
		}
	}
};

/**
 * Set a specific property of the region
 * @param {string} property - Property name (as per sfz specifications)
 * @param {*} value - Value
 */
Aural.Utils.Sfz.Region.prototype.setProperty = function(property, value) {
	switch(property) {
		case 'sample':
			this.sample = value; break;
		case 'lochan':
			this.loChannel = Math.min(16, Math.max(0, parseInt(value, 10))); break;
		case 'hichan':
			this.hiChannel = Math.min(16, Math.max(0, parseInt(value, 10))); break;
		case 'key':
			this.setProperty('lokey', parseInt(value, 10));
			this.setProperty('hikey', parseInt(value, 10));
			this.setProperty('picth_keycenter', parseInt(value, 10));
			break;
		case 'lokey':
			value = (typeof value === 'string' && !/^[0-9]+$/.test(value) ? Aural.Music.Note.getMidiFromLabel(value): parseInt(value, 10));
			this.loKey = Math.min(127, Math.max(0, value)); break;
		case 'hikey':
			value = (typeof value === 'string' && !/^[0-9]+$/.test(value) ? Aural.Music.Note.getMidiFromLabel(value): parseInt(value, 10));
			this.hiKey = Math.min(127, Math.max(0, value)); break;
		case 'lovel':
			this.loVelocity = Math.min(127, Math.max(0, parseInt(value, 10))); break;
		case 'hivel':
			this.hiVelocity = Math.min(127, Math.max(0, parseInt(value, 10))); break;
		case 'lorand':
			this.loRand = Math.min(1, Math.max(0, parseFloat(value))); break;
		case 'hirand':
			this.hiRand = Math.min(1, Math.max(0, parseFloat(value))); break;
		case 'lobpm':
			this.loBpm = Math.min(500, Math.max(0, parseFloat(value))); break;
		case 'hibpm':
			this.hiBpm = Math.min(500, Math.max(0, parseFloat(value))); break;
		case 'seq_length':
			this.sequenceLength = Math.min(100, Math.max(1, parseInt(value, 10))); break;
		case 'seq_position':
			this.sequencePosition = Math.min(100, Math.max(1, parseInt(value, 10))); break;
		case 'volume':
			this.volume = Math.min(6, Math.max(-144, parseFloat(value))); break;
		case 'pan':
			this.pan = Math.min(100, Math.max(-100, parseFloat(value))); break;
		case 'offset':
			this.offset = Math.max(0, parseInt(value, 10)); break;
		case 'offset_random':
			this.offsetRandom = parseInt(value, 10); break;
		case 'end':
			this.end = Math.max(-1, parseInt(value, 10)); break;
		case 'transpose':
			this.transpose = Math.min(127, Math.max(-127, parseInt(value, 10))); break;
		case 'tune':
			this.tune = Math.min(100, Math.max(1, parseInt(value, 10))); break;
		case 'pitch_keycenter':
			value = (typeof value === 'string' && !/^[0-9]+$/.test(value) ? Aural.Music.Note.getMidiFromLabel(value): parseInt(value, 10));
			this.pitchKeyCenter = Math.min(127, Math.max(0, value)); break;
		case 'pitch_keytrack':
			this.pitchKeyTrack = Math.min(1200, Math.max(-1200, parseInt(value, 10))); break;
		case 'pitch_random':
			this.pitchRandom = Math.min(9600, Math.max(0, parseInt(value, 10))); break;
		case 'sw_last':
			value = (typeof value === 'string' && !/^[0-9]+$/.test(value) ? Aural.Music.Note.getMidiFromLabel(value): parseInt(value, 10));
			this.switchLast = Math.min(127, Math.max(0, value)); break;
		case 'sw_lokey':
			value = (typeof value === 'string' && !/^[0-9]+$/.test(value) ? Aural.Music.Note.getMidiFromLabel(value): parseInt(value, 10));
			this.switchLoKey = Math.min(127, Math.max(0, value)); break;
		case 'sw_hikey':
			value = (typeof value === 'string' && !/^[0-9]+$/.test(value) ? Aural.Music.Note.getMidiFromLabel(value): parseInt(value, 10));
			this.switchHiKey = Math.min(127, Math.max(0, value)); break;
		case 'sw_down':
			value = (typeof value === 'string' && !/^[0-9]+$/.test(value) ? Aural.Music.Note.getMidiFromLabel(value): parseInt(value, 10));
			this.switchDown = Math.min(127, Math.max(0, value)); break;
		case 'sw_up':
			value = (typeof value === 'string' && !/^[0-9]+$/.test(value) ? Aural.Music.Note.getMidiFromLabel(value): parseInt(value, 10));
			this.switchUp = Math.min(127, Math.max(0, value)); break;
		case 'sw_previous':
			value = (typeof value === 'string' && !/^[0-9]+$/.test(value) ? Aural.Music.Note.getMidiFromLabel(value): parseInt(value, 10));
			this.switchPrevious = parseInt(value, 10); break;
		default:
			break;
	}
};

/**
 * Check if the region must be triggered by an incoming event
 * @param {Number} key - Midi value
 * @param {Number} cents - Cents
 * @param {Number} velocity - Velocity
 * @param {Number} bpm - Tempo in beats per minutes
 * @param {Number} rand - Random value for round robin
 * @return {boolean} Return whether the region must be triggered
 */
Aural.Utils.Sfz.Region.prototype.matchNote = function(key, cents, velocity, bpm, rand) {
	this.innerSequence++;
	
	if(this.innerSequence > this.sequenceLength) {
		this.innerSequence = 1;
	}
	
	return (
		key >= this.loKey && key <= this.hiKey &&
		velocity >= this.loVelocity && velocity <= this.hiVelocity && //velocity layer
		this.innerSequence === this.sequencePosition && rand >= this.loRand && rand <= this.hiRand && //round robin
		bpm >= this.loBpm && bpm <= this.hiBpm
	);
};

Aural.Utils.Sfz.File = function() {
	this.regions = [];
};

Aural.Utils.Sfz.File.prototype.regions = null;

/**
 * Add a region to the file based on its groups options and its own
 * @param {Object} groupOptions - Group options of the region
 * @param {Object} regionOptions - Own options of the region
 */
Aural.Utils.Sfz.File.prototype.addRegion = function(groupOptions, regionOptions) {
	//ignore regions without sample as defined by the specifications
	if(groupOptions.sample || regionOptions.sample) {
		var region = new Aural.Utils.Sfz.Region();
		region.setProperties(groupOptions);
		region.setProperties(regionOptions);
		this.regions.push(region);
	}
};

/**
 * Parse a given string
 * @param {string} data - Content of a sfz file
 */
Aural.Utils.Sfz.File.prototype.parse = function(data){
	var definitions = data.split(/(<group>|<region>)/i);

	var groupOptions = {};
	var regionOptions = {};
	var inGroup = false;
	var inRegion = false;

	this.regions = [];
	
	for(var i = 0, l = definitions.length; i < l; i++) {
		var definition = definitions[i];

		if(definition === '<group>') {
			inGroup = true;
			inRegion = false;
			groupOptions = {};
			continue;
		}
		
		if(definition === '<region>') {
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
				var regex = /([a-zA-Z-_]*)=([^=]*)(?![a-zA-Z-_]*=)/g;

				while((option = regex.exec(line)) !== null) {
					options[option[1].trim()] = option[2].trim();
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

/**
 * Load a Sfz.File instance from a string
 * @param  {string} string - String to parse
 * @return {Aural.Utils.Sfz.File} File instance
 */
Aural.Utils.Sfz.File.loadFromString = function(string) {
	var file = new Aural.Utils.Sfz.File();
	file.parse(string);
	return file;
};