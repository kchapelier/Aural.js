module("Aural.Music.Phrase");

test('subPhrase', function() {
	var p = new Aural.Music.Phrase();

	p.addNoteEvent(10, 10, 10);
	p.addNoteEvent(20, 20, 10);
	p.addNoteEvent(99, 99, 10);
	p.addNoteEvent(100, 100, 10);
	p.addNoteEvent(101, 101, 10);

	p.addTextEvent('texte 10', 10);
	p.addTextEvent('texte 19', 19);
	p.addTextEvent('texte 20', 20);
	p.addTextEvent('texte 99', 99);
	p.addTextEvent('texte 100', 100);
	p.addTextEvent('texte 101', 101);

	var p2;

	p2 = p.subPhrase(20, 80, true, true);

	equal(p2.noteEvents.length, 3);
	equal(p2.textEvents.length, 3);

	p2 = p.subPhrase(20, 81, true, true);

	equal(p2.noteEvents.length, 4);
	equal(p2.textEvents.length, 4);

	p2 = p.subPhrase(10, 91, true, true);

	equal(p2.noteEvents.length, 5);
	equal(p2.textEvents.length, 6);

	p2 = p.subPhrase(50, 50, false, true);

	equal(p2.noteEvents.length, 0);
	equal(p2.textEvents.length, 2);

	p2 = p.subPhrase(50, 50, true, false);

	equal(p2.noteEvents.length, 2);
	equal(p2.textEvents.length, 0);
});

test('inflexible duration', function() {
	var p = new Aural.Music.Phrase(100, false);
	equal(p.duration, 100);

	p.addNoteEvent(69, 0, 200);
	equal(p.duration, 100);

	p.addTextEvent('marker 1', 300, 100);
	equal(p.duration, 100);
});

test('flexible duration', function() {
	var p = new Aural.Music.Phrase(100, true);
	equal(p.duration, 100);

	p.addNoteEvent(69, 0, 200);
	equal(p.duration, 200);

	p.addTextEvent('marker 1', 300, 100);
	equal(p.duration, 400);
});

test('restrictEvents', function() {
	var p = new Aural.Music.Phrase(100, false);
	p.addNoteEvent(50, 0, 200);
	p.addNoteEvent(51, 50, 40);
	p.addNoteEvent(52, 50, 60);
	p.addNoteEvent(53, 100, 50);
	p.addNoteEvent(54, 150, 50);

	p.restrictEvents();

	equal(p.noteEvents.length, 3);
	var event = null;

	for(var i = 0, l = p.noteEvents.length; i < l; i++) {
		event = p.noteEvents[i];
		
		switch(event.midi) {
			case 50:
				equal(event.duration, 100);
				break;
			case 51:
				equal(event.duration, 40);
				break;
			case 52:
				equal(event.duration, 50);
				break;
			default:
				break;
		}
	}
});

test('removeEvent', function() {
	var p = new Aural.Music.Phrase();

	var event = p.addTextEvent('marker 1', 0, 10);
	p.addTextEvent('marker 2', 10, 10);

	equal(p.removeEvent(event), true);

	equal(p.textEvents.length, 1);
	equal(p.textEvents[0].text, 'marker 2');

	var p = new Aural.Music.Phrase();

	p.addTextEvent('marker 1', 0, 10);
	var event = p.addTextEvent('marker 2', 10, 10);

	equal(p.removeEvent(event), true);

	equal(p.textEvents.length, 1);
	equal(p.textEvents[0].text, 'marker 1');

	equal(p.removeEvent(event), false);

	equal(p.textEvents.length, 1);
});

test('getAllNotes', function() {
	var p = new Aural.Music.Phrase();

	p.addNoteEvent(25, 0, 100);
	p.addNoteEvent(50, 100, 100);
	p.addNoteEvent(25, 10, 10);
	p.addNoteEvent(26, 0, 100);

	var notes = p.getAllNotes();

	equal(notes.length, 3);
	equal(notes[0].midi, 25);
	equal(notes[1].midi, 26);
	equal(notes[2].midi, 50);
});

test('add', function() {
	var p1 = new Aural.Music.Phrase(100);
	p1.addNoteEvent(10, 10, 10);
	p1.addNoteEvent(20, 20, 10);

	var p2 = new Aural.Music.Phrase(200);
	p2.addNoteEvent(30, 0, 50);
	p2.addTextEvent('marker 1', 0, 50);

	p1.add(p2);

	equal(p1.duration, 200);
	equal(p1.noteEvents.length, 3);
	equal(p1.textEvents.length, 1);
});