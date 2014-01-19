"use strict";

Aural.Utils.Scala.File = function(content) {
	this.description = '';
	this.intervals = [];
	
	if(content) {
		this.parse(content);
	}
};

/**
 * Description of the scala file
 * @type {String}
 */
Aural.Utils.Scala.File.prototype.description = null;

/**
 * Number of intervals
 * @type {Number}
 */
Aural.Utils.Scala.File.prototype.numberValues = null;

/**
 * Array of intervals
 * @type {Array}
 */
Aural.Utils.Scala.File.prototype.intervals = null;

/**
 * Parse the content of a scala file and populate the object
 * @param {String} contentFile - Content of the scala file
 */
Aural.Utils.Scala.File.prototype.parse = function(contentFile) {
	contentFile+= "\r\n";
	var lines = contentFile.match(/^.*[\n\r]+|$/gm);
	var countLines = 0;
	
	this.intervals = [];

	var line, interval, parsedInterval;

	for(var x = 0, l = lines.length; x < l; x++) {
		line = lines[x];
		
		if(line.indexOf('!') !== 0) { //exclude comment lines
			switch(countLines) {
				case 0: //first line is description
					this.description = line.trim();
					break;
				case 1:
					this.numberValues = parseInt(line, 10);
					break;
				default:
					interval = line.trim();
					
					if(interval && interval !== '') {
						parsedInterval = this.treatInterval(interval);
						
						if(!isNaN(parsedInterval)) {
							this.intervals.push(parsedInterval);
						}
					}
					break;
			}
			
			countLines++;
		}
	}
	
	if(this.intervals.length !== this.numberValues) {
		throw 'Error in file format';
	}
};

/**
 * Parse a scala interval value and return it as cents
 * @param {String} interval - Interval in any of the valid interval scala format
 * @returns {Number} Interval in cents
 */
Aural.Utils.Scala.File.prototype.treatInterval = function(interval) {
	interval = interval.split(' ')[0];

	var convertedInterval;
	var isCent = false;
	
	if(interval.indexOf('/') > 0) { //ratio notation
		var division = interval.split('/');
		var div1 = parseFloat(division[0]);
		var div2 = parseFloat(division[1]);
		convertedInterval = div1 / div2;
	} else {
		if(interval.indexOf('.') > 0) { //cent notation
			convertedInterval = parseFloat(interval);
			isCent = true;
		} else { //integer ratio notation
			convertedInterval = parseFloat(interval);
		}
	}

	if(!isCent) {
		convertedInterval = 1200 * Math.log(convertedInterval)  / Math.log(2);
	}
	
	return convertedInterval;
};