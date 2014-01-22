"use strict";

Aural.Sound.Interpolation = {
	preferredMode : 'linear',
	process : function(position, data, mode) {
		mode = (mode && !!this[mode] ? mode : this.preferredMode);

		return this[mode](position, data);
	},
	crude : function(position, data) {
		if(data.length === 0) {
			return 0;
		}

		position = Math.round(position) % data.length;

		if(position < 0) {
			position+= data.length;
		}

		return data[position];
	},
	linear : function(position, data) {
		if(data.length === 0) {
			return 0;
		}

		var length = data.length,
			npos = Math.abs(position % length),
			max = Math.ceil(npos),
			min = Math.floor(npos),
			ratio = npos - min;

		max = (max >= length) ? 0 : max;

		return data[max] * ratio + data[min] * (1 - ratio);
	},
	cosine : function(position, data) {
		if(data.length === 0) {
			return 0;
		}

		var length = data.length,
			npos = Math.abs(position % length),
			max = Math.ceil(npos),
			min = Math.floor(npos),
			ratio = npos - min;

		max = (max >= length) ? 0 : max;

		ratio = (1 - Math.cos(ratio * Math.PI)) / 2;
		return data[max] * ratio + data[min] * (1 - ratio);
	}
};