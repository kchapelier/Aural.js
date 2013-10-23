"use strict";

Aural.Music.Scale = function(titles, intervals, key) {
	this.titles = titles;
	this.intervals = intervals;
	this.key = key || 'C';
};

Aural.Music.Scale.prototype.titles = null;
Aural.Music.Scale.prototype.intervals = null;
Aural.Music.Scale.prototype.key = null;

Aural.Music.Scale.HEMITONIC_TYPE_BASIC = '';
Aural.Music.Scale.HEMITONIC_TYPE_COUNT = 'count';
Aural.Music.Scale.HEMITONIC_TYPE_SUCCESSION = 'succession';

Aural.Music.Scale.prototype.getHemitonicType = function(resultType) {
	var nbSemitone = 0;
	var maxSuccessive = 0;
	var previous = 0;
	var successive = 0;
	
	for(var i = 0, l = this.intervals.length; i < l; i++) {
		if(this.intervals[i] == 1) {
			nbSemitone++;
			
			if(previous == 1) {
				successive++;
				maxSuccessive = Math.max(maxSuccessive, successive);
			}
		}
		
		previous = this.intervals[i];
	}
	
	if(this.intervals.length < 12) {
		//iterating a second time to properly count the successive semitones
		for(var i = 0, l = this.intervals.length; i < l; i++) {
			if(this.intervals[i] == 1) {
				if(previous == 1) {
					successive++;
					maxSuccessive = Math.max(maxSuccessive, successive);
				}
			}
			
			previous = this.intervals[i];
		}
	}
	
	switch(resultType) {
		case Aural.Music.Scale.HEMITONIC_TYPE_COUNT:
			switch(nbSemitone) {
				case 0:
					return 'anhemitonic'; break;
				case 1:
					return 'unhemitonic'; break;
				case 2:
					return 'dihemitonic'; break;
				case 3:
					return 'trihemitonic'; break;
				case 4:
					return 'tetrahemitonic'; break;
				case 5:
					return 'pentahemitonic'; break;
				case 6:
					return 'hexahemitonic'; break;
				case 7:
					return 'heptahemitonic'; break;
				case 8:
					return 'octahemitonic'; break;
				case 9:
					return 'enneahemitonic'; break;
				case 10:
					return 'decahemitonic'; break;
				case 11:
					return 'undecahemitonic'; break;
				case 12:
					return 'chromatic'; break;
					
			}
			break;
		case Aural.Music.Scale.HEMITONIC_TYPE_SUCCESSION:
			return (nbSemitone > 0 ? (maxSuccessive > 1 ? 'cohemitonic' : 'ancohemitonic') : 'anhemitonic'); break;
		case Aural.Music.Scale.HEMITONIC_TYPE_BASIC:
		default:
			return (nbSemitone > 0 ? 'hemitonic' : 'anhemitonic'); break;
	}
};

Aural.Music.Scale.prototype.getType = function() {
	switch(this.intervals.length) {
		case 1:
			return 'monotonic'; break; //http://en.wikipedia.org/wiki/Monotonic_scale
		case 2:
			return 'ditonic'; break; //http://en.wikipedia.org/wiki/Ditonic_scale
		case 3:
			return 'tritonic'; break;
		case 4:
			return 'tetratonic'; break;
		case 5:
			return 'pentatonic'; break;
		case 6:
			return 'hexatonic'; break;
		case 7:
			return 'heptatonic'; break;
		case 8:
			return 'octatonic'; break;
		case 9:
			return 'enneatonic'; break;
		case 10:
			return 'decatonic'; break;
		case 11:
			return 'undecatonic'; break;
		case 12:
			return 'chromatic'; break;
		default:
			return '';
	}
};

Aural.Music.Scale.prototype.getNotes = function() {
	var notes = [];
	var current = this.getKeyOffset();
	
	for(var i = 0, l = this.intervals.length; i < l; i++) {
		notes.push(Aural.Music.Note.createFromMidi(current));
		current += this.intervals[i];
	}
	
	return notes;
};

Aural.Music.Scale.prototype.getNotesAsLabels = function() {
	var notes = [];
	var current = this.getKeyOffset();
	var label = null;
	
	for(var i = 0, l = this.intervals.length; i < l; i++) {
		label = Aural.Music.Note.getLabelFromMidi(current);
		notes.push(label[0]);
		current += this.intervals[i];
	}
	
	return notes;
};

Aural.Music.Scale.prototype.getKeyOffset = function() {
	return Aural.Music.Note.getMidiFromLabel(this.key);
};

Aural.Music.Scale.prototype.createCopy = function(key) {
	return new Aural.Music.Scale(this.titles, this.intervals, key);
};