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

test('writeByte', function() {
	var buffer = new Aural.Utils.Buffer('abcd');

	buffer.writeByte(1, 0x32);
	equal(buffer.readByte(1), 0x32);
	buffer.writeByte(3, 0x70);
	equal(buffer.readByte(3), 0x70);

	equal(buffer.toString(), 'a2cp');
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

test('writeBit', function() {
	var buffer = new Aural.Utils.Buffer('abcd');
	
	buffer.writeBit(20, 1);
	equal(buffer.readBit(20), 1);
	equal(buffer.readByte(2), 0x6b);
	
	buffer.writeBit(20, 0);
	equal(buffer.readBit(20), 0);
	equal(buffer.readByte(2), 0x63);
});

test('toggleBit', function() {
	var buffer = new Aural.Utils.Buffer('abcd');
	
	buffer.toggleBit(20);
	equal(buffer.readBit(20), 1);
	equal(buffer.readByte(2), 0x6b);
	
	buffer.toggleBit(20);
	equal(buffer.readBit(20), 0);
	equal(buffer.readByte(2), 0x63);
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

	equal(buffer.readUint24(0), 0x616263);
	equal(buffer.readUint24(1), 0x626364);

	equal(buffer.readUint32(0), 0x61626364);
});

test('readInteger', function() {
	var buffer = new Aural.Utils.Buffer('abcd');
	
	equal(buffer.readInteger(0, 2, 8, false), 0x6162);
	equal(buffer.readInteger(0, 2, 4, false), 0x12);
	equal(buffer.readInteger(1, 3, 4, false), 0x234);
	equal(buffer.readInteger(1, 3, 4, true), 0x432);
	equal(buffer.readInteger(0, 4, 8, true), 0x64636261);
});

test('writeString', function() {
	var buffer = new Aural.Utils.Buffer('abcd');
	buffer.writeString(1, 'xy');
	equal(buffer.toString(), 'axyd');
});

test('readVLQ', function() {
	var buffer = new Aural.Utils.Buffer([0x40]);
	equal(buffer.readVLQ(0), 0x40);
	
	buffer = new Aural.Utils.Buffer([0x7F]);
	equal(buffer.readVLQ(0), 0x7F);
	
	buffer = new Aural.Utils.Buffer([0x81, 0x00]);
	equal(buffer.readVLQ(0), 0x80);
	
	buffer = new Aural.Utils.Buffer([0xC0, 0x00]);
	equal(buffer.readVLQ(0), 0x2000);
	
	buffer = new Aural.Utils.Buffer([0xFF, 0x7F]);
	equal(buffer.readVLQ(0), 0x3FFF);
	
	buffer = new Aural.Utils.Buffer([0x81, 0x80, 0x00]);
	equal(buffer.readVLQ(0), 0x4000);
	
	buffer = new Aural.Utils.Buffer([0xC0, 0x80, 0x00]);
	equal(buffer.readVLQ(0), 0x100000);
	
	buffer = new Aural.Utils.Buffer([0xFF, 0xFF, 0x7F]);
	equal(buffer.readVLQ(0), 0x1FFFFF);
	
	buffer = new Aural.Utils.Buffer([0x81, 0x80, 0x80, 0x00]);
	equal(buffer.readVLQ(0), 0x200000);
	
	buffer = new Aural.Utils.Buffer([0xC0, 0x80, 0x80, 0x00]);
	equal(buffer.readVLQ(0), 0x8000000);
	
	buffer = new Aural.Utils.Buffer([0xFF, 0xFF, 0xFF, 0x7F]);
	equal(buffer.readVLQ(0), 0xFFFFFFF);
});

test('writeVLQ', function() {
	var buffer = new Aural.Utils.Buffer('abcd');

	buffer.writeVLQ(3, 0x40);
	equal(buffer.readVLQ(3), 0x40);
	equal(buffer.readByte(3), 0x40);

	buffer.writeVLQ(3, 0x7F);
	equal(buffer.readVLQ(3), 0x7F);
	equal(buffer.readByte(3), 0x7F);

	buffer.writeVLQ(1, 0x3FFF);
	equal(buffer.readVLQ(1), 0x3FFF);
	equal(buffer.readByte(1), 0xFF);
	equal(buffer.readByte(2), 0x7F);

	buffer.writeVLQ(0, 0x4000);
	equal(buffer.readVLQ(0), 0x4000);
	equal(buffer.readByte(0), 0x81);
	equal(buffer.readByte(1), 0x80);
	equal(buffer.readByte(2), 0x00);

	buffer.writeVLQ(0, 0xFFFFFFF);
	equal(buffer.readVLQ(0), 0xFFFFFFF);
	equal(buffer.readByte(0), 0xFF);
	equal(buffer.readByte(1), 0xFF);
	equal(buffer.readByte(2), 0xFF);
	equal(buffer.readByte(3), 0x7F);
});

test('constructor(array)', function() {
	var buffer = new Aural.Utils.Buffer([255, 254, 253, 252]);
	
	equal(buffer.readByte(0), 255);
	equal(buffer.readByte(1), 254);
	equal(buffer.readByte(2), 253);
	equal(buffer.readByte(3), 252);
});