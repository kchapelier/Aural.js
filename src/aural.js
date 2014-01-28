"use strict";

/* Outlining the structure of the library */

/** @namespace */
var Aural = {
	/** @namespace */
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
	/** @namespace */
	Sound : {
		BufferMap : null,
		Enveloppe : {
			Fixed : null,
			ADSR : null,
			DAHDSR : null
		},
		Granular : {
			Collection : null
		},
		Interpolation : null,
		Wavelet : {
			Wavelet : null,
			Collection : null
		}
	},
	/** @namespace */
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
		Scala : {
			File : null
		},
		Support : null,
		Sfz : {
			Region : null,
			File : null
		}
	},
	/** @namespace */
	Info : {
		version : '-',
		stable : false
	}
};

