"use strict";

//The chord list is currently dictionary based, making it work with a proper parser in the future
//might be insteresting for slash chords, inversion, altered chords and unusual constructs

Aural.Music.ChordList.addDirectShortnameTranslation('Δ', 'M');
Aural.Music.ChordList.addDirectShortnameTranslation('°', 'o');
Aural.Music.ChordList.addDirectShortnameTranslation('ø', 'Ø');

//DYAD
Aural.Music.ChordList.addChord([0, 7],              '5', 'power chord');
Aural.Music.ChordList.addChord([0, 6],              '4+', 'tritone');

//TRIAD
Aural.Music.ChordList.addChord([0, 4, 3],           ['', 'M', 'maj'], 'major');
Aural.Music.ChordList.addChord([0, 3, 4],           ['m', 'min', '-'], 'minor');
Aural.Music.ChordList.addChord([0, 3, 3],           ['dim', 'o', 'mb5'], 'diminished');
Aural.Music.ChordList.addChord([0, 4, 4],           ['aug', '+', 'M#5', 'M+5'], 'augmented');

Aural.Music.ChordList.addChord([0, 4, 2],           'Mb5', 'major flat five');
Aural.Music.ChordList.addChord([0, 2, 5],           'sus2', 'suspended second');
Aural.Music.ChordList.addChord([0, 5, 2],           'sus4', 'suspended fourth');
Aural.Music.ChordList.addChord([0, 5, 3],           'augsus4', 'suspended fourth');

//TETRACHORD
Aural.Music.ChordList.addChord([0, 4, 3, 3],        ['7', 'dom7'], 'dominant seventh');
Aural.Music.ChordList.addChord([0, 4, 3, 4],        ['M7', 'maj7'], 'major seventh');
Aural.Music.ChordList.addChord([0, 3, 4, 3],        ['m7', 'min7', '-7'], 'minor seventh');
Aural.Music.ChordList.addChord([0, 3, 3, 3],        ['dim7', 'o7'], 'diminished seventh');
Aural.Music.ChordList.addChord([0, 3, 3, 4],        ['m7b5', 'Ø7'], 'half-diminished seventh');
Aural.Music.ChordList.addChord([0, 3, 4, 4],        ['mM7', '-M7', 'minmaj7'], 'minor major seventh');
Aural.Music.ChordList.addChord([0, 4, 4, 2],        ['7#5', '7+5', 'aug7', '+7'], 'augmented seventh');
Aural.Music.ChordList.addChord([0, 4, 4, 3],        ['M7#5', 'augmaj7', '+M7'], 'augmented major seventh');
Aural.Music.ChordList.addChord([0, 4, 2, 4],        ['7b5', 'dom7dim5'], 'seventh flat five');

//PENTA CHORD
Aural.Music.ChordList.addChord([0, 4, 3, 3, 4],     ['9', 'dom9'], 'dominant ninth');
Aural.Music.ChordList.addChord([0, 4, 3, 4, 3],     ['M9', 'maj9'], 'major ninth');
Aural.Music.ChordList.addChord([0, 3, 4, 4, 3],     ['mM9', '-M9', 'minmaj9'], 'minor major ninth');
Aural.Music.ChordList.addChord([0, 3, 4, 3, 4],     ['m9', '-9', 'min9'], 'minor dominant ninth');
Aural.Music.ChordList.addChord([0, 4, 4, 3, 3],     ['augM9', '+M9'], 'augmented major ninth');
Aural.Music.ChordList.addChord([0, 4, 4, 2, 4],     ['aug9', '+9'], 'augmented dominant ninth');
Aural.Music.ChordList.addChord([0, 3, 3, 3, 5],     ['dim9', 'o9'], 'diminished ninth');
Aural.Music.ChordList.addChord([0, 3, 3, 3, 4],     ['dimb9', 'ob9'], 'diminished minor ninth');
Aural.Music.ChordList.addChord([0, 3, 3, 4, 4],     ['m9b5', 'Ø9'], 'half diminished ninth');
Aural.Music.ChordList.addChord([0, 3, 3, 4, 3],     ['m9b5b9', 'Øb9'], 'half diminished minor ninth');