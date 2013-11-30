"use strict";

/* Outlining the structure of the library */

var Aural = {
	Music : {
		Tuning : null,
		Note : null,
		Scale : null,
		ScaleList : null,
		Chord : null,
		ChordList : null,
		Interval : null,
		IntervalList : null,
		Phrase : null
	},
	Sound : {
		BufferMap : null,
		Interpolation : null,
		Wavelet : {
			Wavelet : null,
			Collection : null
		}
	},
	Utils : {
		Buffer : null,
		XHR : null,
		Midi : {
			ControlChangesDictionary : null,
			File : null
		},
		MML : {
			File : null
		},
		Support : null,
		Sfz : {
			Region : null,
			File : null
		}
	},
	Info : {
		version : '-',
		stable : false
	}
};

