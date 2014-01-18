"use strict";

Aural.Utils.ScalaFile = function(content) {
	this.description = '';
	this.intervals = [];
	
	if(content) {
		this.parse(content);
	}
};

Aural.Utils.ScalaFile.prototype.description = null;
Aural.Utils.ScalaFile.prototype.numberValues = null;
Aural.Utils.ScalaFile.prototype.intervals = null;

Aural.Utils.ScalaFile.prototype.parse = function(contentFile) {
	contentFile+= "\r\n";
	var lines = contentFile.match(/^.*[\n\r]+|$/gm);
	var countLines = 0;
	
	this.intervals = [];
	this.intervals.push(1);
	
	for(var x = 0, l = lines.length; x < l; x++) {
		var line = lines[x];
		
		if(line.indexOf('!') !== 0) { //exclude comment lines
			switch(countLines) {
				case 0: //first line is description
					this.description = line.trim();
					break;
				case 1:
					this.numberValues = parseInt(line, 10);
					break;
				default:
					var interval = line.trim();
					
					if(interval && interval !== '') {
						interval = this.treatInterval(interval);
						
						if(!isNaN(interval*1)) {
							this.intervals.push(interval);
						}
					}
					break;
			}
			
			countLines++;
		}
	}
	
	if((this.intervals.length - 1) !== this.numberValues) {
		throw 'Error in file format';
	}
	
	console.log(this);
};

Aural.Utils.ScalaFile.prototype.treatInterval = function(interval) {
	interval = interval.split(' ');
	interval = interval[0];
	
	var isCent = false;
	
	if(interval.indexOf('/') > 0) {
		var division = interval.split('/');
		var div1 = parseFloat(division[0]);
		var div2 = parseFloat(division[1]);
		interval = div1 / div2;
	} else {
		if(interval.indexOf('.') > 0) {
			isCent = true;
		}
		
		interval = parseFloat(interval);
	}
	
	return interval;
};