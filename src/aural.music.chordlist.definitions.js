"use strict";

//TODO : allow alternative shortnames (ie: '' = 'M', '7' = 'dom7', '9' = 'dom9')
//TODO : add all 9th alternative chords
//TODO : add power chord (5)

//TRIAD
Aural.Music.ChordList.addChord([0, 4, 3],           '', 'major');
Aural.Music.ChordList.addChord([0, 3, 4],           'm', 'minor');
Aural.Music.ChordList.addChord([0, 3, 3],           'dim', 'diminished');
Aural.Music.ChordList.addChord([0, 4, 4],           'aug', 'augmented');

//TETRACHORD
Aural.Music.ChordList.addChord([0, 4, 3, 3],        '7', 'dominant seventh');
Aural.Music.ChordList.addChord([0, 4, 3, 4],        'M7', 'major seventh');
Aural.Music.ChordList.addChord([0, 3, 4, 3],        'm7', 'minor seventh');
Aural.Music.ChordList.addChord([0, 3, 3, 3],        'dim7', 'diminished seventh');
Aural.Music.ChordList.addChord([0, 3, 3, 4],        'm7b5', 'half-diminished seventh');
Aural.Music.ChordList.addChord([0, 3, 4, 4],        'mM7', 'minor major seventh');
Aural.Music.ChordList.addChord([0, 4, 4, 3],        'M7#5', 'augmented major seventh');
Aural.Music.ChordList.addChord([0, 4, 2, 4],        '7b5', 'seventh flat five');

Aural.Music.ChordList.addChord([0, 4, 3, 7],        'add9', 'added ninth');
//Aural.Music.ChordList.addChord([..........],        'add2', 'added second');

//PENTA CHORD
Aural.Music.ChordList.addChord([0, 4, 3, 3, 4],     '9', 'dominant ninth');
Aural.Music.ChordList.addChord([0, 4, 3, 4, 3],     'M9', 'major ninth');
Aural.Music.ChordList.addChord([0, 3, 4, 4, 3],     'mM9', 'minor major ninth');
Aural.Music.ChordList.addChord([0, 3, 4, 3, 4],     'm9', 'minor dominant ninth');
