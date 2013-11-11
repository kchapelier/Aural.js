"use strict";

Aural.Sound.Interpolation = {
	preferredMode : 'linear',
	process : function(position, data, mode) {
		mode = (mode && !!this[mode] ? mode : this.preferredMode);

		return this[mode](position, data);
	},
	crude : function(position, data) {
		position = Math.round(position) % data.length;

		if(position < 0) {
			position+= data.length;
		}

		return data[position];
	},
	linear : function(position, data) {
		var length = data.length,
			npos = Math.abs(position % length),
			max = Math.ceil(npos),
			min = Math.floor(npos),
			ratio = npos - min;

		max = (max >= length) ? 0 : max;

		return data[max] * ratio + data[min] * (1 - ratio);
	}
};