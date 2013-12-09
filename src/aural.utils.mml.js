"use strict";

//TODO length on note and pause
//TODO length extension ^

Aural.Utils.MML.File = function(mml) {
	this.voices = [];
	
	if(mml) {
		this.parseString(mml);
	}
};

Aural.Utils.MML.File.prototype.voices = null;

Aural.Utils.MML.File.prototype.getVoiceCount = function() {
	return this.voices.length;
};

Aural.Utils.MML.File.prototype.getPhrase = function(voice) {
	var phrase;
	
	if(voice === null || typeof voice === 'undefined') {
		phrase = new Aural.Music.Phrase(0, true);

		for(var i = 0, l = this.voices.length; i < l; i++) {
			var voicePhrase = this.getPhrase(i);
			phrase.add(voicePhrase);
		}
	} else {
		if(!!this.voices[voice]) {
			phrase = new Aural.Music.Phrase(0, true);
			var position = 0;

			for(var i = 0, l = this.voices[voice].length; i < l; i++) {
				var event = this.voices[voice][i];
				//console.log(event);
				var duration = 10; //TODO fix this

				if(event.note !== null) {
					phrase.addNoteEvent(event.note.midi, position, duration, { detune : event.note.cents, pan : event.panning, velocity : event.velocity });
				}

				position+= duration;
			}
		}
	}

	return phrase;
};

Aural.Utils.MML.File.prototype.parseString = function(mml) {
	this.voices = [];

	mml = mml.replace(/(\/\/.*([\r\n]+|$))/ig, ''); //remove the //... comments
	mml = mml.replace(/[\r\n]/ig, '').replace(/(\/\*.*\*\/)/ig, ''); //remove the /* */ comments

	var phrases = mml.replace(/[^0-9a-z><#+-;]/ig, '').split(';');
	
	for(var i = 0, l = phrases.length; i < l; i++) {
		var phrase = phrases[i] + ';';
		
		var cmd = [];
		var voice = [];

		var value = null;
		var tempo = 120;
		var octave = 4;
		var length = 4;
		var velocity = 16;
		var quantize = 6;
		var panning = 4;
		var detune = 0;
		var transpose = 0;
		var position = 0;
		
		for(var c = 0, lc = phrase.length; c < lc; c++) {
			value = phrase[c];
			
			if(value && value.match(/[a-z<>;()]/i) && cmd.length > 0) {
				//special treatment for "kt", the only supported 2 letters command so far
				if(!(value === 't' && cmd.length === 1 && cmd[0] === 'k')) {
					//console.log('cmd : ' + cmd.join(''));
					
					switch(cmd[0]) {
						case '>':
							octave+= Math.max(1, cmd.slice(1).join(''));
							break;
						case '<':
							octave-= Math.max(1, cmd.slice(1).join(''));
							break;
						case 'o':
							octave = parseInt(cmd.slice(1).join(''));
							break;
						case ')':
							volume+= Math.max(1, cmd.slice(1).join(''));
							break;
						case '(':
							volume-= Math.max(1, cmd.slice(1).join(''));
							break;
						case 'l':
							length = parseInt(cmd.slice(1).join(''));
							break;
						case 'v':
							velocity = parseInt(cmd.slice(1).join(''));
							break;
						case 'q':
							quantize = parseInt(cmd.slice(1).join(''));
							break;
						case 'p':
							panning = parseInt(cmd.slice(1).join(''));
							break;
						case 't':
							tempo = parseInt(cmd.slice(1).join(''));
							break;
						case 'k':
							if(cmd[1] === 't') {
								transpose = parseInt(cmd.slice(2).join(''));
							} else {
								detune = parseInt(cmd.slice(1).join('')) / 6400;
							}
							break;
						case 'a':
						case 'b':
						case 'c':
						case 'd':
						case 'e':
						case 'f':
						case 'g':
							var note = cmd[0];
							
							if(cmd[1] == '#' || cmd[1] == '+') {
								note = cmd[0] + '#';
							} else if(cmd[1] == '-') {
								note = cmd[0] + 'b';
							}
							
							//console.log(' * note ' + note + octave + ' ' + transpose + 'st ' + detune + 'cents');

							note = Aural.Music.Note.getMidiFromLabel(note.toUpperCase(), octave);
							note = Aural.Music.Note.createFromMidi(note + transpose, detune);

							voice.push({
								'note' : note,
								'panning' : panning,
								'length' : length,
								'tempo' : tempo,
								'quantize' : quantize,
								'velocity' : velocity
							});

							break;
						case 'r':
							//console.log(' * pause');

							voice.push({
								'note' : null,
								'panning' : panning,
								'length' : length,
								'tempo' : tempo,
								'quantize' : quantize,
								'velocity' : velocity
							});

							break;
					}
					
					//console.log(' * status : detune ' + detune + 'cents transpose ' + transpose + 'st tempo ' + tempo + 'bpm length ' + length + ' octave ' + octave + ' velocity ' + velocity + ' quantize ' + quantize + ' panning ' + panning);
					
					cmd = [];
				}
			}
			
			cmd.push(value);
		}

		if(voice.length > 0) {
			this.voices.push(voice);
		}
	}
};