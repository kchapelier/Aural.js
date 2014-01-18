"use strict";

//TODO methods to read and write C string, pascal string and IEEE floating-point data might become useful
//TODO being able to extend the buffer length as we write inside it will shortly become necessary
//TODO make it possible to return the last accessed byte (should there be a distinction between read or write access ?)
//TODO making it able to write in a stream fashiongm

Aural.Utils.Buffer = function(buffer) {
	var i, l;
	if(typeof buffer === 'string') {
		this.view = new Uint8Array(buffer.length);
		
		for(i = 0, l = buffer.length; i < l; i++) {
			this.view[i] = buffer.charCodeAt(i) % 256;
		}
	} else if(Object.prototype.toString.call(buffer) === '[object Array]') {
		this.view = new Uint8Array(buffer.length);
		
		for(i = 0, l = buffer.length; i < l; i++) {
			this.view[i] = buffer[i] % 256;
		}
	} else {
		this.view = new Uint8Array(buffer);
	}
};

Aural.Utils.Buffer.prototype.view = null;

/**
 * Write a value into the buffer as a variable length quantity
 * @param {Number} start - Starting byte
 * @param {Number} value - Value
 */
Aural.Utils.Buffer.prototype.writeVLQ = function(start, value) {
	var bytes = [];
	
	bytes.push(value & 0x7F);

	while (value >>= 7) {
		bytes.push((value & 0x7F) | 0x80);
	}

	for(var i = 0, l = bytes.length; i < l; i++) {
		this.writeByte(start + l - i - 1, bytes[i]);
	}
};

/**
 * Read a value encoded as a variable length quantity
 * @param {Number} start - Starting byte
 * @return {Number} Value
 */
Aural.Utils.Buffer.prototype.readVLQ = function(start) {
	var value = this.readByte(start);
	var c = null;
	var pos = start;
	
	if(value & 0x80) {
		value &= 0x7F;
		
		do {
			pos++;
			c = this.readByte(pos);
			if(!isNaN(c)) {
				value = (value << 7) + (c & 0x7F);
			}
		} while(c & 0x80);
	}
	
	return value;
};

/**
 * Get the value of a given bit
 * @param {Number} bit - Bit to read
 * @return {Number} Value of the bit (0 or 1)
 */
Aural.Utils.Buffer.prototype.readBit = function(bit) {
	var byte = Math.floor(bit / 8);
	var bitMask = Math.pow(2, 7 - (bit % 8));
	
	return (this.view[byte] & bitMask ? 1 : 0);
};

/**
 * Set the value of a given bit
 * @param {Number} bit - Bit to write
 * @param {Number} value - Value
 */
Aural.Utils.Buffer.prototype.writeBit = function(bit, value) {
	var byte = Math.floor(bit / 8);
	var bitMask;

	if(value > 0) {
		bitMask = Math.pow(2, 7 - (bit % 8));
		this.view[byte] |= bitMask;
	} else {
		bitMask = 0xFF - Math.pow(2, 7 - (bit % 8));
		this.view[byte] &= bitMask;
	}
};

/**
 * Toggle the value of a given bit
 * @param {Number} bit - Bit to toggle
 */
Aural.Utils.Buffer.prototype.toggleBit = function(bit) {
	var byte = Math.floor(bit / 8);
	this.view[byte] ^= Math.pow(2, 7 - (bit % 8));
};

/**
 * Get the value of a given byte
 * @param {Number} byte - Byte to read
 * @return {Number} Unsigned 8 bit integer (0 - 255)
 */
Aural.Utils.Buffer.prototype.readByte = function(byte) {
	var value = null;

	if(this.view.length > byte) {
		value = this.view[byte];
	}

	return value;
};

/**
 * Set the value of a given byte
 * @param {Number} byte - Byte to write
 * @param {Number} value - Value
 */
Aural.Utils.Buffer.prototype.writeByte = function(byte, value) {
	this.view[byte] = value % 256;
};

/**
 * Read the value of a byte as an unsigned 8 bit integer (alias of readByte)
 * @param {Number} byte - Byte to read
 * @return {Number} Unsigned 8 bit integer (0 - 255)
 */
Aural.Utils.Buffer.prototype.readUint8 = function(byte) {
	return this.readByte(byte);
};

/**
 * Write the value of an unsigned 8 bit integer (alias of writeByte)
 * @param {Number} byte - Byte to write
 * @param {Number} value - Value
 */
Aural.Utils.Buffer.prototype.writeUint8 = function(byte, value) {
	this.writeByte(byte, value);
};

/**
 * Read the value of two bytes as an unsigned 16 bit integer
 * @param {Number} byte - Starting byte
 * @return {Number} Unsigned 16 bit integer (0 - 65535)
 */
Aural.Utils.Buffer.prototype.readUint16 = function(byte) {
	return this.readInteger(byte, 2, 8);
};

/**
 * Write the value of an unsigned 16 bit integer
 * @param {Number} byte - Byte to write
 * @param {Number} value - Value
 */
Aural.Utils.Buffer.prototype.writeUint16 = function(byte, value) {
	return this.writeInteger(byte, value, 2, 8);
};

/**
 * Read the value of two bytes as an unsigned 24 bit integer
 * @param {Number} byte - Starting byte
 * @return {Number} Unsigned 24 bit integer (0 - 16777215)
 */
Aural.Utils.Buffer.prototype.readUint24 = function(byte) {
	return this.readInteger(byte, 3, 8);
};

/**
 * Write the value of an unsigned 24 bit integer
 * @param {Number} byte - Byte to write
 * @param {Number} value - Value
 */
Aural.Utils.Buffer.prototype.writeUint24 = function(byte, value) {
	return this.writeInteger(byte, value, 3, 8);
};

/**
 * Read the value of four bytes as an unsigned 32 bit integer
 * @param {Number} byte - Starting byte
 * @return {Number} Unsigned 32 bit integer (0 - 4294967295)
 */
Aural.Utils.Buffer.prototype.readUint32 = function(byte) {
	return this.readInteger(byte, 4, 8);
};

/**
 * Write the value of an unsigned 32 bit integer
 * @param {Number} byte - Byte to write
 * @param {Number} value - Value
 */
Aural.Utils.Buffer.prototype.writeUint32 = function(byte, value) {
	return this.writeInteger(byte, value, 4, 8);
};

/**
 * Read a specificly formated integer
 * @param {Number} start - Starting byte
 * @param {Number} length - Number of bytes to read
 * @param {Number} [significantBits=8] - Number of bit pers bytes to take into account
 * @param {boolean} [lsbFirst=false] - Whether the least significant bytes are first
 * @return {Number} Integer
 */
Aural.Utils.Buffer.prototype.readInteger = function(start, length, significantBits, lsbFirst) {
	var value = 0;
	significantBits = significantBits || 8;
	var bitMask = (Math.pow(2, significantBits) - 1);
	var coeff = null;
	for(var i = 0, c = start, l = start + length; c < l; i++, c++) {
		coeff = (lsbFirst ? Math.pow(2, significantBits * i) : Math.pow(2, significantBits * (length - i - 1)));
		value += (this.readByte(c) & bitMask) * coeff;
	}
	
	return value;
};

/**
 * Write a specificly formated integer
 * @param {Number} start - Starting byte
 * @param {Number} value - Value
 * @param {Number} length - Number of bytes to read
 * @param {Number} [significantBits=8] - Number of bit pers bytes to take into account
 * @param {boolean} [lsbFirst=false] - Whether the least significant bytes are first
 */
Aural.Utils.Buffer.prototype.writeInteger = function(start, value, length, significantBits, lsbFirst) {
	significantBits = significantBits || 8;
	var bitMask = (Math.pow(2, significantBits) - 1);
	
	for(var i = 0; i < length; i++) {
		this.writeByte(lsbFirst ? start + i : start + length - i - 1, value & bitMask);
		
		value = value >> significantBits;
	}
};

/**
 * Read a string from the buffer
 * @param {Number} start - Starting byte
 * @param {Number} length - Number of bytes to read
 * @param {boolean} [ignoreCRLF=false] - Whether to ignore the carriage returns and line feeds (0x0A and 0x0D)
 * @return {string} String
 */
Aural.Utils.Buffer.prototype.readString = function(start, length, ignoreCRLF) {
	var string = '';
	var value = null;
	var end = Math.min(start + length, this.view.length);

	for(var i = start; i < end; i++) {
		value = this.view[i];

		if(ignoreCRLF && (value === 0x0A || value === 0x0D)) {
			continue;
		}

		string+= String.fromCharCode(value);
	}

	return string;
};

/**
 * Write a string in the buffer
 * @param {Number} start - Starting byte
 * @param {string} value - String
 */
Aural.Utils.Buffer.prototype.writeString = function(start, value) {
	for(var i = 0; i < value.length; i++) {
		this.view[start + i] = value.charCodeAt(i) % 256;
	}
};

/**
 * Get the length of the buffer
 * @return {Number} Length
 */
Aural.Utils.Buffer.prototype.getLength = function() {
	return this.view.length;
};

/**
 * Return the whole buffer as a string
 * @return {string} Buffer as a string
 */
Aural.Utils.Buffer.prototype.toString = function() {
	return this.readString(0, this.view.length, false);
};

/**
 * Return a human readable dump of the buffer
 * @param {Number} start - Starting byte
 * @param {Number} length - Length
 * @return {string} String
 */
Aural.Utils.Buffer.prototype.dump = function(start, length) {
	start = start || 0;
	length = length || this.view.length;
	var end = Math.min(start + length, this.view.length);
	var i;

	var str = '*0 *1 *2 *3     *4 *5 *6 *7     *8 *9 *A *B     *C *D *E *F\n';
	str+= '-----------------------------------------------------------\n';
	
	var value = null;

	var offset = start % 16;

	for(i = 0; i < offset; i++) {
		str+= '.. ';

		if((i + 1) % 4 === 0) {
			str+= '    ';
		}
	}

	for(i = start; i < end; i++) {
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
 * @param {Number} start - Starting byte
 * @param {Number} length - Length
 * @return {string} String
 */
Aural.Utils.Buffer.prototype.dumpBinary = function(start, length) {
	start = start || 0;
	length = length || this.view.length;
	var end = Math.min(start + length, this.view.length);
	var i, l;

	var str = '*******0 *******1 ******10 ******11 *****100 *****101 *****110 *****111\n';
	str+= '-----------------------------------------------------------------------\n';
	
	var value = null;

	var offset = start % 8;

	for(i = 0; i < offset; i++) {
		str+= '........ ';
	}

	for(i = start; i < end; i++) {
		value = this.readByte(i).toString(2);

		for(l = 8 - value.length; l--;) {
			value = '0' + value;
		}

		str+= value + ' ';

		if((i + 1) % 8 === 0) {
			str+= '\n';
		}
	}

	return str;
};