module("Aural.Utils.Buffer");

test('getLength', function() {
	var buffer = new Aural.Utils.Buffer('abcdefgh');

	equal(buffer.getLength(), 8);
});

test('toString', function() {
	var buffer = new Aural.Utils.Buffer('abcdefgh');

	equal(buffer.toString(), 'abcdefgh');
});

test('readByte', function() {
	var buffer = new Aural.Utils.Buffer('abcdefgh');

	equal(buffer.readByte(0), 97);
	equal(buffer.readByte(1), 98);
	equal(buffer.readByte(2), 99);
	equal(buffer.readByte(3), 100);
});

test('readBit', function() {
	var buffer = new Aural.Utils.Buffer('abcdefgh');

	equal(buffer.readBit(0), 0);
	equal(buffer.readBit(1), 1);
	equal(buffer.readBit(2), 1);
	equal(buffer.readBit(3), 0);
	equal(buffer.readBit(4), 0);
	equal(buffer.readBit(5), 0);
	equal(buffer.readBit(6), 0);
	equal(buffer.readBit(7), 1);
	
	equal(buffer.readBit(8), 0);
	equal(buffer.readBit(9), 1);
	equal(buffer.readBit(10), 1);
	equal(buffer.readBit(11), 0);
	equal(buffer.readBit(12), 0);
	equal(buffer.readBit(13), 0);
	equal(buffer.readBit(14), 1);
	equal(buffer.readBit(15), 0);
});

test('readString', function() {
	var buffer = new Aural.Utils.Buffer('abcdefgh');

	equal(buffer.readString(0, 4), 'abcd');
	equal(buffer.readString(0, 3), 'abc');
	equal(buffer.readString(1, 3), 'bcd');
});

test('readUint', function() {
	var buffer = new Aural.Utils.Buffer('abcdefgh');

	equal(buffer.readUint8(0), 97);
	equal(buffer.readUint8(1), 98);
	equal(buffer.readUint8(2), 99);
	equal(buffer.readUint8(3), 100);

	equal(buffer.readUint16(0), 0x6162);
	equal(buffer.readUint16(1), 0x6263);
	equal(buffer.readUint16(2), 0x6364);

	equal(buffer.readUint32(0), 0x61626364);
});

test('readInteger', function() {
	var buffer = new Aural.Utils.Buffer('abcdefgh');

	equal(buffer.readInteger(0, 2, 8, false), 0x6162);
	equal(buffer.readInteger(0, 2, 8, true), 0x6261);

	//console.log(buffer.readInteger(0, 2, 4, false), 0x12);
});