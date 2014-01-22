module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat : {
			options : {
				process : function(src, filepath) {
					src = src.replace(/^[ \t]*("use strict"|'use strict');/gm, '') //remove "use strict"
						.replace(/^[\r\n]+/g, '') //remove linefeeds at the beginning of the files
						.replace(/[\r\n]+$/g, '') //remove linefeeds at the end of the files
						.replace(/^(.+)/gm, '\t$1'); //add one tab before any line with actual code
					
					src = '\n\t/* SOURCE FILE : ' + filepath + ' */\n' + src;
					
					return src;
				},
				banner : 'var Aural = (function() {\n\t"use strict";\n',
				footer : '\n\n\treturn Aural;\n})();'
			},
			dist : {
				src : [
					'src/**.js', '!src/**.definitions.js', 'src/**.definitions.js',
					'!src/aural.sound.sample.js', '!src/aural.sound.soundfont.js' //ignore messy pseudo code files
				],
				dest : 'build/aural.js'
			}
		},
		uglify : {
			my_targets : {
				files : {
					'build/aural.min.js' : ['build/aural.js']
				}
			}
		},
		connect: {
			server: {
				options: {
					port: 8000,
					base: '.'
				}
			}
		},
		qunit: {
			all: {
				options : {
					timeout : 10000,
					force : true,
					urls: ['http://localhost:8000/test/test.html']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-qunit');

	grunt.registerTask('default', [
		'concat', //concatenate the library in an "use strict" IIFE
		'uglify' //minify the concatenated file
	]);

	grunt.registerTask('test', [
		'connect', //create a simple web server for the unit tests
		'qunit' //run unit tests (note that it is currently crashing due to the lack of webaudio API in phantom.js)
	]);

	grunt.registerTask('full', ['test', 'default']);
};