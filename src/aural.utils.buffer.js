"use strict";

//TODO implements write methods
//TODO make test cases for readVLQ and readInteger with signicantBits != 8
//TODO make test cases using array as data source
//TODO try to find a way to get the value of a bit that would not depend on toString (too slow)

Aural.Utils.Buffer = function(buffer) {
	if(typeof buffer == 'string') {
		this.view = new Uint8Array(buffer.length);
		
		for(var i = 0, l = buffer.length; i < l; i++) {
			this.view[i] = buffer.charCodeAt(i);
		}
	} else if(Object.prototype.toString.call(buffer) == '[object Array]') {
		this.view = new Uint8Array(buffer.length);
		
		for(var i = 0, l = buffer.length; i < l; i++) {
			this.view[i] = buffer[i];
		}
	} else {
		this.view = new Uint8Array(buffer);
	}
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
 * Get the value of a given bit
 * @param {integer} bit - Bit to read
 * @return {integer} Value of the bit (0 or 1)
 */
Aural.Utils.Buffer.prototype.readBit = function(bit) {
	var value = null;
	var byte = Math.floor(bit / 8);
	var bitPos = bit % 8;
	var binary = this.view[byte].toString(2);
	bitPos+= binary.length - 8;
	
	if(this.view.length > byte) {
		value = !!binary[bitPos] ? parseInt(binary[bitPos]) : 0;
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
 * Read the value of a byte as an unsigned 8 bit integer (alias of readByte)
 * @param {integer} byte - Byte to read
 * @return {integer} Unsigned 8 bit integer (0 - 255)
 */
Aural.Utils.Buffer.prototype.readUint8 = function(byte) {
	return this.readByte(byte);
};

/**
 * Read the value of two bytes as an unsigned 16 bit integer
 * @param {integer} byte - Starting byte
 * @return {integer} Unsigned 16 bit integer (0 - 65535)
 */
Aural.Utils.Buffer.prototype.readUint16 = function(byte) {
	return this.readInteger(byte, 2, 8);
};

/**
 * Read the value of two bytes as an unsigned 24 bit integer
 * @param {integer} byte - Starting byte
 * @return {integer} Unsigned 24 bit integer (0 - 16777215)
 */
Aural.Utils.Buffer.prototype.readUint24 = function(byte) {
	return this.readInteger(byte, 2, 8);
};

/**
 * Read the value of four bytes as an unsigned 32 bit integer
 * @param {integer} byte - Starting byte
 * @return {integer} Unsigned 32 bit integer (0 - 4294967295)
 */
Aural.Utils.Buffer.prototype.readUint32 = function(byte) {
	return this.readInteger(byte, 4, 8);
};

/**
 * Read a specificly formated integer
 * @param {integer} byte - Starting byte
 * @param {integer} length - Number of bytes to read
 * @param {integer} significantBits - Number of bit pers bytes to take into account (defaut = 8)
 * @param {boolean} lsbFirst - Whether the least significant bytes are first (default = false)
 * @return {integer} Integer
 */
Aural.Utils.Buffer.prototype.readInteger = function(start, length, significantBits, lsbFirst) {
	var value = 0;
	significantBits = significantBits || 8;
	
	for(var i = 0, c = start, l = start + length; c < l; i++, c++) {
		var coeff = (lsbFirst ? Math.pow(2, significantBits * i) : Math.pow(2, significantBits * (length - i - 1)));
		value += this.readByte(c) * coeff;
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
 * Return the whole buffer as a string
 * @return {string} uffer as a string
 */
Aural.Utils.Buffer.prototype.toString = function() {
	return this.readString(0, this.view.length, false);
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

/**
 * Return a human readable dump of the buffer as binary values
 * @param {integer} start - Starting byte
 * @param {integer} length - Length
 * @return {string} String
 */
Aural.Utils.Buffer.prototype.dumpBinary = function(start, length) {
	start = start || 0;
	length = length || this.view.length;
	var end = Math.min(start + length, this.view.length);

	var str = '*******0 *******1 ******10 ******11 *****100 *****101 *****110 *****111\n';
	str+= '-----------------------------------------------------------------------\n';
	
	var value = null;

	var offset = start % 8;

	for(var i = 0; i < offset; i++) {
		str+= '........ ';
	}

	for(var i = start; i < end; i++) {
		value = this.readByte(i).toString(2);

		for(var l = 8 - value.length; l--;) {
			value = '0' + value;
		}

		str+= value + ' ';

		if((i + 1) % 8 === 0) {
			str+= '\n';
		}
	}

	return str;
};