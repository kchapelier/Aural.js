"use strict";

Aural.Music.Phrase = function(duration, flexible) {
	this.noteEvents = [];
	this.textEvents = [];
	
	duration = duration || 10;
	
	this.setFlexible(flexible);
	this.setDuration(duration);
};

Aural.Music.Phrase.prototype.name = null;
Aural.Music.Phrase.prototype.bpm = null;
Aural.Music.Phrase.prototype.duration = null;
Aural.Music.Phrase.prototype.flexible = null;
Aural.Music.Phrase.prototype.noteEvents = null;
Aural.Music.Phrase.prototype.textEvents = null;

/**
 * Set the name of the phrase
 * @param {string} name - Name
 */
Aural.Music.Phrase.prototype.setName = function(name) {
	this.name = name;
};

/**
 * Set the beats per minute of the phrase
 * @param (float) bpm - Beats per minute
 */
Aural.Music.Phrase.prototype.setBpm = function(bpm) {
	this.bpm = bpm;
};

/**
 * Set the duration of the phrase
 * @param {float} duration - Duration
 */
Aural.Music.Phrase.prototype.setDuration = function(duration) {
	this.duration = duration;
};

/**
 * Set whether the duration should be flexible to automatically adapt to new inserted events
 * @param {boolean} flexible - Flexibility
 */
Aural.Music.Phrase.prototype.setFlexible = function(flexible) {
	this.flexible = !!flexible;
};

/**
 * Remove an event
 * @param {NoteEvent|TextEvent} event - Event to remove
 * @return {boolean} Success
 */
Aural.Music.Phrase.prototype.removeEvent = function(event) {
	var pos = -1;
	
	if(event instanceof Aural.Music.Phrase.TextEvent) {
		pos = this.textEvents.indexOf(event);
		
		if(pos >= 0) {
			this.textEvents.splice(pos, 1);
		}
	} else if(event instanceof Aural.Music.Phrase.NoteEvent) {
		pos = this.noteEvents.indexOf(event);
		
		if(pos >= 0) {
			this.noteEvents.splice(pos, 1);
		}
	}
	
	return pos >= 0;
};

Aural.Music.Phrase.prototype.add = function(addPhrase) {
	this.setDuration(Math.max(this.duration, addPhrase.duration));
	
	for(var i = 0, l = addPhrase.noteEvents.length; i < l; i++) {
		this.noteEvents.push(addPhrase.noteEvents[i].copy());
	}
	
	for(var i = 0, l = addPhrase.textEvents.length; i < l; i++) {
		this.textEvents.push(addPhrase.textEvents[i].copy());
	}
};

/**
 * Add a note event
 * @param {integer} midi - Midi value
 * @param {float} start - Start
 * @param {float} duration - Duration
 * @param {object} options - Additional options (velocity, pan and detune)
 * @return {NoteEvent} Event
 */
Aural.Music.Phrase.prototype.addNoteEvent = function(midi, start, duration, options) {
	options = options || {};
	duration = duration || 0;
	
	var event = new Aural.Music.Phrase.NoteEvent(midi, options.detune || 0, start, duration, options.velocity || 1, options.pan || 0);
	
	this.noteEvents.push(event);
	
	if(this.flexible) {
		this.duration = Math.max(this.duration, start + duration);
	}
	
	return event;
};

/**
 * Add a text event
 * @param {string} text - Text
 * @param {float} start - Start
 * @param {float} duration - Duration
 * @param {object} options - Additional options (type)
 * @return {TextEvent} Event
 */
Aural.Music.Phrase.prototype.addTextEvent = function(text, start, duration, options) {
	options = options || {};
	duration = duration || 0;
	
	var event = new Aural.Music.Phrase.TextEvent(options.type, text, start, duration);
	
	this.textEvents.push(event);
	
	if(this.flexible) {
		this.duration = Math.max(this.duration, start + duration);
	}
	
	return event;
};

/**
 * Restrict all the events to the given duration (or the duration of the phrase)
 * @param {float} duration - Duration
 */
Aural.Music.Phrase.prototype.restrictEvents = function(duration) {
	if(duration) {
		this.setDuration(duration);
	}
	
	duration = this.duration;
	
	var event = null;
	var events = [];
	
	for(var i = 0, l = this.noteEvents.length; i < l; i++) {
		event = this.noteEvents[i];
		
		if(event.start < duration) {
			event.duration = Math.min(duration - event.start, event.duration);
			events.push(event);
		}
	}
	
	this.noteEvents = events;
	
	events = [];
	
	for(var i = 0, l = this.textEvents.length; i < l; i++) {
		event = this.textEvents[i];
		
		if(event.start < duration) {
			event.duration = Math.min(duration - event.start, event.duration);
			events.push(event);
		}
	}
	
	this.textEvents = events;
};

/**
 * Get all the different notes within the phrase from the lowest to the highest
 * @return {Aural.Music.Note[]} Array of Notes
 */
Aural.Music.Phrase.prototype.getAllNotes = function() {
	var notes = [];
	var midiFound = {};
	var midi = null;
	
	for(var i = 0, l = this.noteEvents.length; i < l; i++) {
		midi = this.noteEvents[i].midi;
		if(!midiFound[midi]) {
			midiFound[midi] = true;
			notes.push(Aural.Music.Note.createFromMidi(midi));
		}
	}
	
	notes.sort(function(a, b) {
		if(a.midi > b.midi) {
			return 1;
		} else if(a.midi < b.midi) {
			return -1;
		}
		
		return 0;
	});
	
	return notes;
};



/**
 * Get all the scales matching the phrase
 * @param {boolean} exactOnly - Whether to return only the scales matching exactly without any additionnal notes
 * @return {Aural.Music.Scale[]} Array of matching scales
 */
Aural.Music.Phrase.prototype.getMatchingScales = function(exactOnly) {
	var notes = this.getAllNotes();
	
	return Aural.Music.ScaleList.fits(notes, exactOnly);
};

/**
 * Return a subset of the phrase
 * @param {integer} start - Start
 * @param {integer} length - Length
 * @param {boolean} includeNoteEvents - Whether to include the note events
 * @param {boolean} includeTextEvents - Whether to include the text events
 * @return {Phrase} Subset of the phrase
 */
Aural.Music.Phrase.prototype.subPhrase = function(start, length, includeNoteEvents, includeTextEvents) {
	var subPhrase = new Aural.Music.Phrase();
	
	var events = this.getEvents(start, length, includeNoteEvents, includeTextEvents);
	var event = null;
	
	for(var i = 0, l = events.noteEvents.length; i < l; i++) {
		event = events.noteEvents[i];
		subPhrase.addNoteEvent(event.midi, event.start - start, event.duration, { 'detune' : event.detune, 'velocity' : event.velocity, 'pan' : event.pan });
	}
	
	for(var i = 0, l = events.textEvents.length; i < l; i++) {
		event = events.textEvents[i];
		subPhrase.addTextEvent(event.text, event.start - start, event.duration, { 'type' : event.type });
	}
	
	return subPhrase;
};

/**
 * Return events from the phrase
 * @param {integer} start - Start of period to search in
 * @param {integer} length - Length of the period to search in
 * @param {boolean} includeNoteEvents - Whether to include the note events
 * @param {boolean} includeTextEvents - Whether to include the text events
 * @return {object} Object with the matchings noteEvents and textEvents
 */
Aural.Music.Phrase.prototype.getEvents = function(start, length, includeNoteEvents, includeTextEvents) {
	var events = {
		noteEvents : [],
		textEvents : []
	};
	
	var event = null;
	
	var end = start + length;
	
	if(includeNoteEvents) {
		for(var i = 0, l = this.noteEvents.length; i < l; i++) {
			event = this.noteEvents[i];
			
			if(event.start >= start && event.start <= end) {
				events.noteEvents.push(event);
			}
		}
	}
	
	if(includeTextEvents) {
		for(var i = 0, l = this.textEvents.length; i < l; i++) {
			event = this.textEvents[i];
			
			if(event.start >= start && event.start <= end) {
				events.textEvents.push(event);
			}
		}
	}
	
	return events;
};

/**
 * Return a copy of the phrase
 * @return {Aural.Music.Phrase} Copy of the phrase
 */
Aural.Music.Phrase.prototype.copy = function() {
	var copy = new Aural.Music.Phrase(this.duration, this.flexible);
	
	for(var i = 0, l = this.noteEvents.length; i < l; i++) {
		
	}
	
	copy.setDuration(this.duration);
	
	return copy;
};


Aural.Music.Phrase.NoteEvent = function(midi, detune, start, duration, velocity, pan) {
	this.start = start || 0;
	this.midi = midi;
	this.duration = duration || 0;
	
	this.velocity = velocity || 1;
	this.pan = pan || 0;
	this.detune = detune || 0;
};

Aural.Music.Phrase.NoteEvent.prototype.velocity = null;
Aural.Music.Phrase.NoteEvent.prototype.pan = null;
Aural.Music.Phrase.NoteEvent.prototype.midi = null;
Aural.Music.Phrase.NoteEvent.prototype.detune = null;
Aural.Music.Phrase.NoteEvent.prototype.start = null;
Aural.Music.Phrase.NoteEvent.prototype.duration = null;

/**
 * Return a copy of the event
 * @return {Aural.Music.Phrase.NoteEvent} Copy of the event
 */
Aural.Music.Phrase.NoteEvent.prototype.copy = function() {
	return new Aural.Music.Phrase.NoteEvent(this.midi, this.detune, this.start, this.duration, this.velocity, this.pan);
};


Aural.Music.Phrase.TextEvent = function(type, text, start, duration) {
	this.start = start || 0;
	this.type = type || 'marker';
	this.text = text;
	this.duration = duration || 0;
};

Aural.Music.Phrase.TextEvent.prototype.text = null;
Aural.Music.Phrase.TextEvent.prototype.start = null;
Aural.Music.Phrase.TextEvent.prototype.duration = null;
Aural.Music.Phrase.TextEvent.prototype.type = null;

/**
 * Return a copy of the event
 * @return {Aural.Music.Phrase.TextEvent} Copy of the event
 */
Aural.Music.Phrase.TextEvent.prototype.copy = function() {
	return new Aural.Music.Phrase.TextEvent(this.type, this.text, this.start, this.duration);
};