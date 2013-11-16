"use strict";

//TODO implements write methods
//TODO make test cases (esp. for readVLQ)
//TODO allow loading a buffer from a binary string
//TODO make debug dump method

Aural.Utils.Buffer = function(buffer) {
	this.view = new Uint8Array(buffer);
};

Aural.Utils.Buffer.prototype.view = null;

/*
Aural.Utils.Buffer.prototype.writeVLQ = function(start, value) {
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
*/

/**
 * Read a value encoded as a variable length quantity
 * @param {integer} start - Starting byte
 * @return {integer} Value
 */
Aural.Utils.Buffer.prototype.readVLQ = function(start) {
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
};

/**
 * Get the value of a given byte
 * @param {integer} byte - Byte to read
 * @return {integer} Unsigned 8 bit integer (0 - 255)
 */
Aural.Utils.Buffer.prototype.readByte = function(byte) {
	var value = null;

	if(this.view.length > byte) {
		value = this.view[byte];
	}

	return value;
};

/**
 * Read a string from the buffer
 * @param {integer} start - Starting byte
 * @param {integer} length - Number of bytes to read
 * @param {boolean} ignoreCRLF - Whether to ignore the carriage returns and line feeds (0x0A and 0x0D) 
 * @return {string} String
 */
Aural.Utils.Buffer.prototype.readString = function(start, length, ignoreCRLF) {
	var string = '';
	var value = null;
	var end = Math.min(start + length, this.view.length);

	for(var i = start; i < end; i++) {
		value = this.view[i];

		if(ignoreCRLF && (value == 0x0A || value == 0x0D)) {
			continue;
		}

		string+= String.fromCharCode(value);
	}

	return string;
};

/**
 * Get the length of the buffer
 * @return {integer} Length
 */
Aural.Utils.Buffer.prototype.getLength = function() {
	return this.view.length;
};

/**
 * Return a human readable dump of the buffer
 * @param {integer} start - Starting byte
 * @param {integer} length - Length
 * @return {string} String
 */
Aural.Utils.Buffer.prototype.dump = function(start, length) {
	start = start || 0;
	length = length || this.view.length;
	var end = Math.min(start + length, this.view.length);

	var str = '*0 *1 *2 *3     *4 *5 *6 *7     *8 *9 *A *B     *C *D *E *F\n';
	str+= '-----------------------------------------------------------\n';
	
	var value = null;

	var offset = start % 16;

	for(var i = 0; i < offset; i++) {
		str+= '.. ';

		if((i + 1) % 4 === 0) {
			str+= '    ';
		}
	}

	for(var i = start; i < end; i++) {
		value = this.readByte(i).toString(16);

		if(value.length < 2) {
			value = '0' + value;
		}

		str+= value + ' ';

		if((i + 1) % 4 === 0) {
			str+= '    ';
		}

		if((i + 1) % 16 === 0) {
			str+= '\n';
		}
	}

	return str;
};