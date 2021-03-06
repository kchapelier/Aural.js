"use strict";

Aural.Sound.Enveloppe.Fixed = function(shape, length, resolution) {
	this.resolution = resolution > 0 ? resolution : 1;
	this.shape = shape;
	this.setLength(length);
};

Aural.Sound.Enveloppe.Fixed.prototype.length = null;
Aural.Sound.Enveloppe.Fixed.prototype.resolution = null;
Aural.Sound.Enveloppe.Fixed.prototype.shape = null;
Aural.Sound.Enveloppe.Fixed.prototype.processedShape = null;

/**
 * Calculate the shape of the enveloppe
 */
Aural.Sound.Enveloppe.Fixed.prototype.process = function() {
	var i, l, l2;
	var realLength = this.length * this.resolution;
	var processedShape = new Float32Array(this.length);
	
	var type = ({}).toString.call(this.shape);
	var maxValue = 0;
	
	switch(type) {
		case '[object Function]':
			for(i = 0, l = realLength; i < l; i++) {
				processedShape[i] = this.shape(i, l);
				maxValue = Math.max(Math.abs(processedShape[i]), maxValue);
			}
			break;
		case '[object String]':
			var splittedShape = this.shape.split(':');
			var func = splittedShape[0].toLowerCase();
			var order = !!splittedShape[1] ? parseInt(splittedShape[1], 10) : 0;
			
			if(!!Aural.Sound.Enveloppe.Fixed.List[func]) {
				for(i = 0, l = realLength; i < l; i++) {
					processedShape[i] = Aural.Sound.Enveloppe.Fixed.List[func](i, l, order, this.length);
					maxValue = Math.max(Math.abs(processedShape[i]), maxValue);
				}
			} else {
				throw "unknown fixed enveloppe";
			}
			break;
		default:
			for(i = 0, l = realLength, l2 = this.shape.length; i < l; i++) {
				processedShape[i] = Aural.Sound.Interpolation.linear(i * l2 / l, this.shape);
				maxValue = Math.max(Math.abs(processedShape[i]), maxValue);
			}
	}
	
	this.normalizationRatio = maxValue > 0 ? 1 / maxValue : 1;
	this.processedShape = processedShape;
};

/**
 * Modify the resolution of the enveloppe
 * @param {Number} resolution - Resolution
 */
Aural.Sound.Enveloppe.Fixed.prototype.setResolution = function(resolution) {
	this.resolution = resolution > 0 ? resolution : 1;
	this.process();
};

/**
 * Modify the length of the enveloppe
 * @param {Number} length - Length
 */
Aural.Sound.Enveloppe.Fixed.prototype.setLength = function(length) {
	this.length = length > 0 ? length : 1;
	this.process();
};

/**
 * Get the amplitude of the enveloppe at a specified sample
 * @param {Number} sample - Position in the enveloppe
 * @param {Number} normalized - Whether to return a normalized sample
 * @returns {Number} Amplitude
 */
Aural.Sound.Enveloppe.Fixed.prototype.getAmplitude = function(sample, normalized) {
	var realSample = sample * this.resolution;
	
	if(realSample < 0 || realSample > this.length - 1) {
		return 0;
	}
	
	return Aural.Sound.Interpolation.linear(realSample, this.processedShape) * (normalized ? this.normalizationRatio : 1);
};

Aural.Sound.Enveloppe.Fixed.List = {
	'gaussian' : function(i, l, order) {
		order = Math.max(3, order ? order : 3);
		order = 1 / order;
		var r = Math.pow((i - (l - 1) / 2) / ((l - 1) / 2 * order), 2) / -2;
		return Math.pow(Math.E, r);
	},
	'gaussian2' : function(i, l) {
		return 2.5 * (1 / Math.sqrt(2 * Math.PI)) * Math.pow(Math.E, (-1 * Math.pow((i - l / 2)* l, 2) / (2 * Math.pow(l * l / 500 * 80, 2))));
	},
	'tukeywindow' : function(i, l, order) {
		order = Math.max(1, order ? Math.floor(order) : 2);
		order = l / (order ? order : 2);
		//Tukey Window
		return (
			i < order / 2 ?
				(1 + Math.cos(2 * Math.PI / order * (i - order / 2))) / 2
			: (
				i < l - order / 2 ?
				1
				:
				(1 + Math.cos(2 * Math.PI / order * (i - 1 + order / 2))) / 2
			)
		);
	},
	'rectangularantialiased' : function(i, l, order, length) {
		order = order || Math.max(1, Math.floor(length / 48));

		var val = 0;
		for(var n = 1; n <= order; n = n + 2) {
			val+= Math.sin(i * n * Math.PI / l) / n;
		}
		return val;
	},
	'triangularantialiased' : function(i, l, order, length) {
		order = order || Math.max(1, Math.floor(length / 48));

		var val = 0;
		for(var n = 1; n <= order; n+=2) {
			val+= Math.sin((l - i) * n * Math.PI / l) * (Math.pow(-1, (n-1) / 2) / (n * n));
		}
		return val * 8 / (Math.PI * Math.PI);
	},
	'rampupantialiased' : function(i, l, order, length) {
		order = order || Math.max(1, Math.floor(length / 48));

		var val = 0;
		for(var n = 1; n <= order; n++) {
			val+= Math.sin((l - i) * n * Math.PI / l) / n;
		}
		return val * 2 / Math.PI;
	},
	'rampdownantialiased' : function(i, l, order, length) {
		order = order || Math.max(1, Math.floor(length / 48));
		
		var val = 0;
		for(var n = 1; n <= order; n++) {
			val+= Math.sin(i * n * Math.PI / l) / n;
		}
		return val * 2 / Math.PI;
	},
	'rampup' : function(i, l) {
		return l === 1 ? 1 : (i % l / (l - 1));
	},
	'rampdown' : function(i, l) {
		return l === 1 ? 1 : ((l - i - 1) % (l) / (l - 1));
	},
	'sinc' : function(i, l, order) {
		order = Math.max(1, order ? Math.floor(order) : 1);
		return (i === 0 ? 1 : Math.sin(i / l * Math.PI * order) / (i / l * Math.PI * order));
	},
	'doublesinc' : function(i, l, order) {
		order = Math.max(2, order ? Math.floor(order) * 2 : 2);
		var s = i - (l / 2);
		return (s === 0 ? 1 : Math.sin(s / l * Math.PI * order) / (s / l * Math.PI * order));
	},
	'rectangular' : function() {
		return 1;
	},
	'triangular' : function(i, l) {
		var r = l / 2;
		return (
			i >= r ?
			(i % r / r * -1 + 1) :
			(i % r / r)
		);
	},
	'trapezoid' : function(i, l) {
		var r = l / 3;
		var s = i / r;
		return (s < 1 ? s % 1 : (s > 2 ? 1-s % 1 : 1));
	},
	'rectifiedsine' : function(i, l) {
		return Math.sin(i * Math.PI / l);
	},
	'expodec2' : function(i, l) {
		return (Math.exp((l - i) / l) - 1) / (Math.E - 1);
	},
	'rexpodec2' : function(i, l) {
		return (Math.exp(i / l) - 1) / (Math.E - 1);
	},
	'expodec' : function(i, l, order) {
		order = Math.max(2, order ? Math.floor(order) : 2);
		return (Math.pow(1 - i / l, order));
	},
	'rexpodec' : function(i, l, order) {
		order = Math.max(2, order ? Math.floor(order) : 2);
		return (Math.pow(i / l, order));
	},
	'expopuls' : function(i, l, order) {
		order = Math.max(2, order ? Math.floor(order) : 2);
		return Math.abs(Math.pow(i < l / 2 ? i / l * 2 : (i - l) / l * 2, order));
	},
	'welchwindow' : function(i, l) {
		return 1 - Math.pow((i - (l-1)/2) / ((l+1) / 2), 2);
	},
	'hannwindow' : function(i, l) {
		return (1 - Math.cos(2 * Math.PI * i / (l - 1))) / 2;
	},
	'linearpulse' : function(i, l, order) {
		var r = i / order;
		return (r >=1 ? 0 : Aural.Sound.Interpolation.linear(r, [1, 0]));
	}
};

//aliases
Aural.Sound.Enveloppe.Fixed.List['quasigaussian'] = Aural.Sound.Enveloppe.Fixed.List['tukeywindow'];