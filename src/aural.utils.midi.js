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

	console.log(' * correct header : trackNumber ' + this.trackNumber + ' format ' + this.format + ' fps ' + this.fps);

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

	console.log(' * correct header track ' + trackNumber);

	var trackLength = view[offset + 4] * Math.pow(256, 3) + view[offset + 5] * Math.pow(256, 2) + view[offset + 6] * 256 + view[offset + 7];

	console.log(' * track length ' + trackLength);

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
					case 0x00:
						console.log(' * sequence number');
						break;
					case 0x01:
						console.log(' * meta text', this.readString(cmdBuffer, 3, cmdBuffer.length - 1, true));
						break;
					case 0x02:
						console.log(' * meta copyright', this.readString(cmdBuffer, 3, cmdBuffer.length - 1, true));
						break;
					case 0x03:
						console.log(' * meta sequence label', this.readString(cmdBuffer, 3, cmdBuffer.length - 1, true));
						break;
					case 0x04:
						console.log(' * meta instrument name', this.readString(cmdBuffer, 3, cmdBuffer.length - 1, true));
						break;
					case 0x05:
						console.log(' * meta lyric', this.readString(cmdBuffer, 3, cmdBuffer.length - 1, true));
						break;
					case 0x06:
						console.log(' * meta marker', this.readString(cmdBuffer, 3, cmdBuffer.length - 1, true));
						break;
					case 0x07:
						console.log(' * meta cue point', this.readString(cmdBuffer, 3, cmdBuffer.length - 1, true));
						break;
					case 0x2F:
						console.log(' * end of track');
						break;
					case 0x51:
						var v1 = cmdBuffer[3];
						var v2 = cmdBuffer[4];
						var v3 = cmdBuffer[5];
						console.log(' * tempo', v1, v2, v3);
						break;
					case 0x54:
						console.log(' * SMPTE offset (currently ignored)');
						break;
					case 0x58:
						var v1 = cmdBuffer[3];
						var v2 = cmdBuffer[4];
						var v3 = cmdBuffer[5];
						var v4 = cmdBuffer[6];
						console.log(' * time signature', v1, v2, v3, v4);
						break;
					case 0x59:
						var v1 = cmdBuffer[3];
						var v2 = cmdBuffer[4];
						console.log(' * key signature', v1, v2);
						break;
					case 0x7F:
						console.log(' * sequencer specific meta (currently ignored)');
						break;
				}
			} else if(cmdBuffer[0] >= 0x80 && cmdBuffer[0] <= 0x8F) {
				var channel = 1 + cmdBuffer[0] - 0x80;
				var note = cmdBuffer[1];
				var velocity = cmdBuffer[2];

				console.log(' * note off', 'channel ' + channel + ' note ' + note + ' velocity ' + velocity);
			} else if(cmdBuffer[0] >= 0x90 && cmdBuffer[0] <= 0x9F) {
				var channel = 1 + cmdBuffer[0] - 0x90;
				var note = cmdBuffer[1];
				var velocity = cmdBuffer[2];

				console.log(' * note on', 'channel ' + channel + ' note ' + note + ' velocity ' + velocity);
			} else if(cmdBuffer[0] >= 0xA0 && cmdBuffer[0] <= 0xAF) {
				var channel = 1 + cmdBuffer[0] - 0xA0;
				var note = cmdBuffer[1];
				var value = cmdBuffer[2];

				console.log(' * polyphonic aftertouch', 'channel ' + channel + ' note ' + note + ' pressure ' + value);
			} else if(cmdBuffer[0] >= 0xB0 && cmdBuffer[0] <= 0xBF) {
				var channel = 1 + cmdBuffer[0] - 0xB0;
				var controlNumber = cmdBuffer[1];
				var controlName = Aural.Utils.Midi.ControlChangesDictionary.getName(controlNumber);
				var value = cmdBuffer[2];

				console.log(' * control change', 'channel ' + channel + ' cc ' + controlNumber + '(' + (controlName ? controlName : 'unknown') + ') value ' + value);
			} else if(cmdBuffer[0] >= 0xC0 && cmdBuffer[0] <= 0xCF) {
				var channel = 1 + cmdBuffer[0] - 0xC0;
				var program = cmdBuffer[1];

				console.log(' * program change', 'channel ' + channel + ' program ' + program);
			} else if(cmdBuffer[0] >= 0xD0 && cmdBuffer[0] <= 0xDF) {
				var channel = 1 + cmdBuffer[0] - 0xD0;
				var pressure = cmdBuffer[1];

				console.log(' * channel aftertouch', 'channel ' + channel + ' pressure ' + value);
			} else if(cmdBuffer[0] >= 0xE0 && cmdBuffer[0] <= 0xEF) {
				var channel = 1 + cmdBuffer[0] - 0xE0;
				var lsb = cmdBuffer[1];
				var msb = cmdBuffer[2];

				var value = lsb + msb * 128;

				console.log(' * pitch wheel change', 'channel ' + channel + ' lsb ' + lsb + ' msb ' + msb + ' value ' + value);
			}

			cmdBuffer = [];
		}

		trOffset++;
	}

	this.tracks.push(events);

	return offset + trOffset;
};

Aural.Utils.Midi.File.prototype.readString = function(cmdBuffer, start, end, ignoreCRLF) {
	var string = '';
	var value = null;
	for(var i = start, l = cmdBuffer.length; i < l && i < end; i++) {
		value = cmdBuffer[i];

		if(ignoreCRLF && (value == 0x0A || value == 0x0D)) {
			continue;
		}

		string+= String.fromCharCode(value);
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
		4  : { label : 'foot controller', shortname : 'foot' },
		5  : { label : 'portamento time', shortname : 'portamento' },
		6  : { label : 'data entry msb' },
		7  : { label : 'channel volume', shortname : 'volume' },
		8  : { label : 'balance' },
		10 : { label : 'pan' },
		11 : { label : 'expression controller', shortname : 'expression' },
		12 : { label : 'effect control 1', shortname : 'fx1' },
		13 : { label : 'effect control 2', shortname : 'fx2' },
		16 : { label : 'general purpose controller 1' },
		17 : { label : 'general purpose controller 2' },
		18 : { label : 'general purpose controller 3' },
		19 : { label : 'general purpose controller 4' },
		65 : { label : 'portamento on/off' },
		66 : { label : 'sostenuto on/off' },
		67 : { label : 'soft pedal on/off' },
		68 : { label : 'legato footswitch' },
		69 : { label : 'hold 2' },
		70 : { label : 'sound controller 1' },
		71 : { label : 'sound controller 2' },
		72 : { label : 'sound controller 3' },
		73 : { label : 'sound controller 4' },
		74 : { label : 'sound controller 5' },
		75 : { label : 'sound controller 6' },
		76 : { label : 'sound controller 7' },
		77 : { label : 'sound controller 8' },
		78 : { label : 'sound controller 9' },
		79 : { label : 'sound controller 10' },
		80 : { label : 'general purpose controller 5' },
		81 : { label : 'general purpose controller 6' },
		82 : { label : 'general purpose controller 7' },
		83 : { label : 'general purpose controller 8' },
		84 : { label : 'portamento control' },
		91 : { label : 'effects 1 depth', shortname : 'fx1 depth' },
		92 : { label : 'effects 2 depth', shortname : 'fx2 depth' },
		93 : { label : 'effects 3 depth', shortname : 'fx3 depth' },
		94 : { label : 'effects 4 depth', shortname : 'fx4 depth' },
		95 : { label : 'effects 5 depth', shortname : 'fx5 depth' },
		120: { label : 'all sound off' },
		121: { label : 'reset all controllers' },
		122: { label : 'local control on/off' },
		123: { label : 'all notes off', shortname : 'panic' },
		126: { label : 'mono mode on', shortname : 'mono' },
		127: { label : 'poly mode on', shortname : 'poly' }
	},
	reverseDictionary : {},
	getName : function(cc) {
		if(!!this.dictionary[cc] && !!this.dictionary[cc]['label']) {
			return this.dictionary[cc].label;
		}

		return null;
	},
	get : function(cc) {
		if(!!this.dictionary[cc]) {
			return this.dictionary[cc];
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
delete Aural.Utils.Midi.ControlChangesDictionary.buildReverseDictionary;