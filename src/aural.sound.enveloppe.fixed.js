"use strict";

Aural.Sound.Enveloppe.Fixed = function(shape, length) {
	this.shape = shape;
	this.setLength(length);
};

Aural.Sound.Enveloppe.Fixed.prototype.process = function() {
	var i, l, l2;
	var processedShape = new Float32Array(this.length);
	
	var type = ({}).toString.call(this.shape);
	
	switch(type) {
		case '[object Function]':
			for(i = 0, l = this.length; i < l; i++) {
				processedShape[i] = this.shape(i, l);
			}
			break;
		case '[object String]':
			var splittedShape = this.shape.split(':');
			var func = splittedShape[0].toLowerCase();
			var order = !!splittedShape[1] ? parseInt(splittedShape[1]) : 0;
			console.log(func, order);
			
			if(!!Aural.Sound.Enveloppe.Fixed.List[func]) {
				for(i = 0, l = this.length; i < l; i++) {
					processedShape[i] = Aural.Sound.Enveloppe.Fixed.List[func](i, l, order);
				}
			} else {
				throw "unknown fixed enveloppe";
			}
			break;
		default:
			for(i = 0, l = this.length, l2 = this.shape.length; i < l; i++) {
				processedShape[i] = Aural.Sound.Interpolation.linear(i * l2 / l, this.shape);
			}
	}
	
	this.processedShape = processedShape;
};

Aural.Sound.Enveloppe.Fixed.prototype.setLength = function(length) {
	this.length = length > 0 ? length : 1;
	this.process();
};

Aural.Sound.Enveloppe.Fixed.prototype.getAmplitude = function(sample) {
	if(sample < 0 || sample > this.length - 1) {
		return 0;
	}
	
	return Aural.Sound.Interpolation.linear(sample, this.processedShape);
};

Aural.Sound.Enveloppe.Fixed.List = {
	'gaussian' : function(i, l) {
		//most likely incorrect
		return 2.5 * (1 / Math.sqrt(2 * Math.PI)) * Math.pow(Math.E, (-1 * Math.pow((i - l / 2)* l, 2) / (2 * Math.pow(l * l / 500 * 80, 2))));
	},
	'tukeywindow' : function(i, l, order) {
		order = Math.max(1, order ? Math.floor(order) : 2);
		order = length / (order ? order : 2);
		//Tukey Window
		return (
			i < order / 2 ?
				(1 + Math.cos(2 * Math.PI / order * (i - order / 2))) / 2
			: (
				i < length - order / 2 ?
				1
				:
				(1 + Math.cos(2 * Math.PI / order * (i - 1 + order / 2))) / 2
			)
		);
	},
	'rampup' : function(i, l) {
		return (i % l / l);
	},
	'rampdown' : function(i, l) {
		return ((l - i) % l / l);
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
		order = Math.max(0, order ? Math.floor(order) : 0);
		return (Math.pow(1 - i / l, order));
	},
	'rexpodec' : function(i, l, order) {
		order = Math.max(0, order ? Math.floor(order) : 0);
		return (Math.pow(i / l, order));
	},
	'expopuls' : function(i, l, order) {
		order = Math.max(0, order ? Math.floor(order) : 0);
		return Math.abs(Math.pow(i < l / 2 ? i / l * 2 : (i - l) / l * 2, order));
	}
};

//aliases
Aural.Sound.Enveloppe.Fixed.List['quasigaussian'] = Aural.Sound.Enveloppe.Fixed.List['tukeywindow'];