"use strict";

function wvl(value) {
	var buffer = value & 0x7F;
	
	while((value >>= 7)) {
		buffer <<= 8;
		buffer |= ((value & 0x7F) | 0x80);
	}
	
	var result = '';
	
	//console.log(buffer);
	//console.log(buffer.toString(16));
	
	while(true) {
		console.log(1);
		
		var inter = buffer.toString(16);
		if(inter.length < 2) {
			inter = '0' + inter;
		}
		
		result+= inter;
		
		if(buffer & 0x80) {
			buffer = buffer >> 8;
		} else {
			break;
		}
	}
	
	return result;
}

function rvl(value) {
	var c = null;
	var h = value.toString(16);
	var pos = 0;
	
	value = parseInt(h.substr(pos, 2), 16);
	pos+= 2;
	
	//console.log(value);
	
	if(value & 0x80) {
		value &= 0x7F;
		
		do {
			c = parseInt(h.substr(pos, 2), 16);
			pos+=2;
			if(!isNaN(c)) {
				value = (value << 7) + (c & 0x7F);
			}
		} while(c && 80);
	}
	
	return value;
}

/*

console.table([
	[(0x40).toString(16), rvl(0x40).toString(16)],
	[(0x7F).toString(16), rvl(0x7F).toString(16)],
	[(0x8100).toString(16), rvl(0x8100).toString(16)],
	[(0xC000).toString(16), rvl(0xC000).toString(16)],
	[(0xFFFF7F).toString(16), rvl(0xFF7F).toString(16)],
	[(0x818000).toString(16), rvl(0x818000).toString(16)],
	[(0xC08000).toString(16), rvl(0xC08000).toString(16)],
	[(0x81808000).toString(16), rvl(0x81808000).toString(16)],
	[(0xFFFFFF7F).toString(16), rvl(0xFFFFFF7F).toString(16)]
]);

*/

Aural.Utils.Midi.File = function(buffer) {
	if(buffer) {
		this.readBuffer(buffer);
	}
};

Aural.Utils.Midi.File.prototype.buffer = null;
Aural.Utils.Midi.File.prototype.view = null;

Aural.Utils.Midi.File.prototype.format = null;
Aural.Utils.Midi.File.prototype.trackNumber = null;
Aural.Utils.Midi.File.prototype.fps = null;
Aural.Utils.Midi.File.prototype.tracks = null;

Aural.Utils.Midi.File.prototype.readBuffer = function(buffer) {
	var offset = 0;

	this.buffer = buffer;
	this.view = new Uint8Array(buffer);
	this.tracks = [];

	offset = this.readFileHeader(offset);

	console.log('correct header');

	console.log(this.trackNumber);

	for(var i = 0; i < this.trackNumber; i++) {
		offset = this.readTrack(offset, i);
	}
};

Aural.Utils.Midi.File.prototype.readTrack = function(offset, trackNumber) {
	var view = this.view;
	var events = [];

	if(
		view[offset + 0] !== 0x4D || view[offset + 1] !== 0x54 || view[offset + 2] !== 0x72 || view[offset + 3] !== 0x6B
	) {
		throw('incorrect header track ' + trackNumber);
	}

	console.log('correct header track ' + trackNumber);

	var trackLength = view[offset + 4] * Math.pow(256, 3) + view[offset + 5] * Math.pow(256, 2) + view[offset + 6] * 256 + view[offset + 7];

	console.log('track length ' + trackLength);

	offset = offset + 8;

	var trOffset = 0;
	var cmdBuffer = [];
	var current = null;

	while(trOffset < trackLength) {
		current = view[offset + trOffset];

		cmdBuffer.push(current);

		if(current == 0) {
			var str = '';
			for(var i = 0, l = cmdBuffer.length; i < l; i++) {
				str+= cmdBuffer[i].toString(16) + ' ';
			}

			console.log('cmd : ' + str);

			if(cmdBuffer[0] == 0xFF) {
				switch(cmdBuffer[1]) {
					case 0x02:
						console.log('copyright', this.parseString(cmdBuffer, 2, cmdBuffer.length - 1));
						break;
					case 0x03:
						console.log('sequence label', this.parseString(cmdBuffer, 2, cmdBuffer.length - 1));
						break;
					case 0x04:
						console.log('instrument name', this.parseString(cmdBuffer, 2, cmdBuffer.length - 1));
						break;
					case 0x05:
						console.log('lyric', this.parseString(cmdBuffer, 2, cmdBuffer.length - 1));
						break;
					case 0x06:
						console.log('marker', this.parseString(cmdBuffer, 2, cmdBuffer.length - 1));
						break;
					case 0x07:
						console.log('cue point', this.parseString(cmdBuffer, 2, cmdBuffer.length - 1));
						break;
				}
			} else if(cmdBuffer[0] >= 0x80 && cmdBuffer[0] <= 0x8F) {
				var channel = cmdBuffer[0] - 0x80;
				var note = cmdBuffer[1];
				var velocity = cmdBuffer[2];

				console.log('note off', 'channel ' + channel + ' note ' + note + ' velocity ' + velocity);
			} else if(cmdBuffer[0] >= 0x90 && cmdBuffer[0] <= 0x9F) {
				var channel = cmdBuffer[0] - 0x90;
				var note = cmdBuffer[1];
				var velocity = cmdBuffer[2];

				console.log('note on', 'channel ' + channel + ' note ' + note + ' velocity ' + velocity);
			} else if(cmdBuffer[0] >= 0xA0 && cmdBuffer[0] <= 0xAF) {
				var channel = cmdBuffer[0] - 0xA0;
				var note = cmdBuffer[1];
				var value = cmdBuffer[2];

				console.log('polyphonic aftertouch', 'channel ' + channel + ' note ' + note + ' pressure ' + value);
			} else if(cmdBuffer[0] >= 0xB0 && cmdBuffer[0] <= 0xBF) {
				var channel = cmdBuffer[0] - 0xB0;
				var controlNumber = cmdBuffer[1];
				var controlName = Aural.Utils.Midi.ControlChangesDictionary.getName(controlNumber);
				var value = cmdBuffer[2];

				console.log('control change', 'channel ' + channel + ' cc ' + controlNumber + '(' + (controlName ? controlName : 'unknown') + ') value ' + value);
			} else if(cmdBuffer[0] >= 0xC0 && cmdBuffer[0] <= 0xCF) {
				var channel = cmdBuffer[0] - 0xC0;
				var program = cmdBuffer[1];

				console.log('program change', 'channel ' + channel + ' program ' + program);
			} else if(cmdBuffer[0] >= 0xD0 && cmdBuffer[0] <= 0xDF) {
				var channel = cmdBuffer[0] - 0xD0;
				var pressure = cmdBuffer[1];

				console.log('channel aftertouch', 'channel ' + channel + ' pressure ' + value);
			}

			cmdBuffer = [];
		}

		trOffset++;
	}

	this.tracks.push(events);

	return offset + trOffset;
};

Aural.Utils.Midi.File.prototype.parseString = function(cmdBuffer, start, end) {
	var string = '';
	for(var i = start, l = cmdBuffer.length; i < l && i < end; i++) {
		string+= String.fromCharCode(cmdBuffer[i]);
	}
	return string;
};

Aural.Utils.Midi.File.prototype.readFileHeader = function(offset) {
	var view = this.view;

	//check header
	if(
		view[offset + 0] !== 0x4D || view[offset + 1] !== 0x54 || view[offset + 2] !== 0x68 || view[offset + 3] !== 0x64 ||
		view[offset + 4] !== 0x00 || view[offset + 5] !== 0x00 || view[offset + 6] !== 0x00 || view[offset + 7] !== 0x06
	) {
		throw('incorrect header file');
	}
	
	this.format = view[offset + 9];
	this.trackNumber = view[offset + 11];
	this.fps = view[offset + 13];

	if(this.format > 1) {
		throw('unsupported format : ' + format);
	}

	if(this.trackNumber < 1 || (this.format === 0 && this.trackNumber > 1)) {
		throw('incorrect track number');
	}

	return offset + 14;
};

Aural.Utils.Midi.ControlChangesDictionary = {
	dictionary : {
		0  : { label : 'bank select', shortname : 'bank' },
		1  : { label : 'modulation wheel', shortname : 'mod' },
		2  : { label : 'breath controller', shortname : 'breath' },
		3  : null,
		4  : { label : 'foot controller', shortname : 'foot' },
		5  : { label : 'portamento time', shortname : 'portamento' },
		6  : { label : 'data entry msb' },
		7  : { label : 'channel volume', shortname : 'volume' },
		8  : { label : 'balance' },
		9  : null,
		10 : { label : 'pan' },
		11 : { label : 'expression controller', shortname : 'expression' },
		12 : { label : 'effect control 1', shortname : 'fx1' },
		13 : { label : 'effect control 2', shortname : 'fx2' }
	},
	reverseDictionary : {},
	getName : function(cc) {
		if(!!this.dictionary[cc] && !!this.dictionary[cc]['label']) {
			return this.dictionary[cc].label;
		}

		return null;
	},
	getCC : function(name) {
		if(!!this.reverseDictionary[name]) {
			return this.reverseDictionary[name];
		}

		return null;
	},
	buildReverseDictionary : function() {
		var control = null;
		var reverseDictionary = {};

		for(var key in this.dictionary) {
			control = this.dictionary[key];
			key = parseInt(key, 10);

			if(control !== null) {
				if(!!control['label']) {
					reverseDictionary[control.label] = key;
				}

				if(!!control['shortname']) {
					reverseDictionary[control.shortname] = key;
				}
			}
		}

		this.reverseDictionary = reverseDictionary;
	}
};

//build the reverse dictionary for the ControlChangesDictionary
Aural.Utils.Midi.ControlChangesDictionary.buildReverseDictionary();
//delete Aural.Utils.Midi.ControlChangesDictionary.buildReverseDictionary;