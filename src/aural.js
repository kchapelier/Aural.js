"use strict";

/* Outlining the structure of the library */

var Aural = {
	Music : {
		Tuning : null,
		Note : null,
		Scale : null,
		ScaleList : null,
		Chord : null,
		ChordList : null
	},
	Sound : {
		Interpolation : null,
		Automation : null, //support
		Sample : null,
		Soundfont : null, //round robin & velocity layer
		Wavelet : null,
		WaveletPlayer : null
	},
	Utils : {
		Scala : null
	},
	Info : {
		version : '0.0.1',
		stable : false
	}
};