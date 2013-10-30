"use strict";

//TODO : allow alternative shortnames (ie: '' = 'M', '7' = 'dom7', '9' = 'dom9')
//TODO : ideally, added tone chords should be figured out procedurally

//DYAD
Aural.Music.ChordList.addChord([0, 7],              '5', 'power chord');
Aural.Music.ChordList.addChord([0, 6],              '4+', 'tritone');

//TRIAD
Aural.Music.ChordList.addChord([0, 4, 3],           '', 'major');
Aural.Music.ChordList.addChord([0, 3, 4],           'm', 'minor');
Aural.Music.ChordList.addChord([0, 3, 3],           'dim', 'diminished');
Aural.Music.ChordList.addChord([0, 4, 4],           'aug', 'augmented');

Aural.Music.ChordList.addChord([0, 4, 2],           'Mb5', 'major flat five');
Aural.Music.ChordList.addChord([0, 2, 5],           'sus2', 'suspended second');
Aural.Music.ChordList.addChord([0, 5, 2],           'sus4', 'suspended fourth');
Aural.Music.ChordList.addChord([0, 5, 3],           'augsus4', 'suspended fourth');


//TETRACHORD
Aural.Music.ChordList.addChord([0, 4, 3, 3],        '7', 'dominant seventh');
Aural.Music.ChordList.addChord([0, 4, 3, 4],        'M7', 'major seventh');
Aural.Music.ChordList.addChord([0, 3, 4, 3],        'm7', 'minor seventh');
Aural.Music.ChordList.addChord([0, 3, 3, 3],        'dim7', 'diminished seventh');
Aural.Music.ChordList.addChord([0, 3, 3, 4],        'm7b5', 'half-diminished seventh');
Aural.Music.ChordList.addChord([0, 3, 4, 4],        'mM7', 'minor major seventh');
Aural.Music.ChordList.addChord([0, 4, 4, 3],        'M7#5', 'augmented major seventh');
Aural.Music.ChordList.addChord([0, 4, 2, 4],        '7b5', 'seventh flat five');

//PENTA CHORD
Aural.Music.ChordList.addChord([0, 4, 3, 3, 4],     '9', 'dominant ninth');
Aural.Music.ChordList.addChord([0, 4, 3, 4, 3],     'M9', 'major ninth');
Aural.Music.ChordList.addChord([0, 3, 4, 4, 3],     'mM9', 'minor major ninth');
Aural.Music.ChordList.addChord([0, 3, 4, 3, 4],     'm9', 'minor dominant ninth');
Aural.Music.ChordList.addChord([0, 4, 4, 3, 3],     'augM9', 'augmented major ninth');
Aural.Music.ChordList.addChord([0, 4, 4, 2, 4],     'aug9', 'augmented dominant ninth');
Aural.Music.ChordList.addChord([0, 3, 3, 3, 5],     'dim9', 'diminished ninth');
Aural.Music.ChordList.addChord([0, 3, 3, 3, 4],     'dimb9', 'diminishes minor ninth');
Aural.Music.ChordList.addChord([0, 3, 3, 4, 4],     'm9b5', 'half diminised');
Aural.Music.ChordList.addChord([0, 3, 3, 4, 3],     'm9b5b9', 'half diminished minor ninth');