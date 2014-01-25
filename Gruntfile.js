module.exports = function(grunt) {
	var testServerPort = 8000;
	var filesToIgnore = ['src/aural.sound.sample.js', 'src/aural.sound.soundfont.js'];

	var appendIgnoredFiles = function(files) {
		for(var i = 0, l = filesToIgnore.length; i < l; i++) {
			files.push('!' + filesToIgnore[i]);
		}
		
		return files;
	};

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
				src : appendIgnoredFiles(['src/**.js', '!src/**.definitions.js', 'src/**.definitions.js']),
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
		connect : {
			server : {
				options : {
					port : testServerPort,
					base : '.'
				}
			},
		},
		qunit : {
			source : {
				options : {
					timeout : 10000,
					force : false,
					urls: ['http://localhost:' + testServerPort + '/test/test.html']
				}
			},
			minified : {
				options : {
					timeout : 10000,
					force : false,
					urls: ['http://localhost:' + testServerPort + '/test/test.min.html']
				}
			},
		},
		jshint : {
			options : {
				jshintrc : true,
				force : true
			},
			source : appendIgnoredFiles(['src/**.js', '!src/aural.js']),
			concatenated : ['build/aural.js']
		},
		jsdoc : {
			dist : {
				src: appendIgnoredFiles(['src/**.js']),
				options: {
					destination: 'doc/html'
				}
			}
		},
		clean : ['build', 'doc/html']
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', [
		'jshint:source', //validates the source files with jshint
		'concat', //concatenate the library in an "use strict" IIFE
		'jshint:concatenated', //validates the minified files with jshint
		'uglify' //minify the concatenated file
	]);

	grunt.registerTask('serve', ['connect:server:keepalive']);

	grunt.registerTask('testminified', [
		'connect', //create a simple web server for the unit tests
		'qunit:minified' //run unit tests on the minified file
	]);

	grunt.registerTask('testsource', [
		'connect', //create a simple web server for the unit tests
		'qunit:source' //run unit tests on the source files (note that it is currently crashing due to the lack of webaudio API in phantom.js)
	]);

	grunt.registerTask('full', [
		'clean', //remove the doc/html/ and build/ folders
		'jsdoc', //generate the documentation
		'connect', //create a simple web server for the unit tests
		//'qunit:source', //run unit tests on the source files (note that it is currently crashing due to the lack of webaudio API in phantom.js)
		'default', //validates, concatenates and minify
		'qunit:minified' //run unit tests on the minified file
	]);
};