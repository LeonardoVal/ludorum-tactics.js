﻿/** Gruntfile for [ludorum-tactics.js](http://github.com/LeonardoVal/ludorum-tactics.js).
*/
var sourceFiles = [ 'src/__prologue__.js',
	'src/TacticsGame.js',
// end
	'src/__epilogue__.js'];

module.exports = function(grunt) {
	grunt.file.defaultEncoding = 'utf8';
// Init config. ////////////////////////////////////////////////////////////////////////////////////
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat_sourcemap: { ////////////////////////////////////////////////////////////////////////
			build: {
				src: sourceFiles,
				dest: 'build/<%= pkg.name %>.js',
				options: {
					separator: '\n\n'
				}
			},
		},
		jshint: { //////////////////////////////////////////////////////////////////////////////////
			build: {
				options: { // Check <http://jshint.com/docs/options/>.
					loopfunc: true,
					boss: true
				},
				src: ['build/<%= pkg.name %>.js'],
			},
		},
		uglify: { //////////////////////////////////////////////////////////////////////////////////
			build: {
				src: 'build/<%= pkg.name %>.js',
				dest: 'build/<%= pkg.name %>.min.js',
				options: {
					banner: '//! <%= pkg.name %> <%= pkg.version %>\n',
					report: 'min',
					sourceMap: true,
					sourceMapIn: 'build/<%= pkg.name %>.js.map',
					sourceMapName: 'build/<%= pkg.name %>.min.js.map'
				}
			}
		},
		karma: { ///////////////////////////////////////////////////////////////////////////////////
			options: {
				configFile: 'tests/karma.conf.js'
			},
			build: { browsers: ['PhantomJS'] },
			chrome: { browsers: ['Chrome'] },
			firefox: { browsers: ['Firefox'] },
			iexplore: { browsers: ['IE'] }
		},
		docker: { //////////////////////////////////////////////////////////////////////////////////
			build: {
				src: ['src/**/*.js', 'README.md', 'docs/*.md'],
				dest: 'docs/docker',
				options: {
					colourScheme: 'borland',
					ignoreHidden: true,
					exclude: 'src/__prologue__.js,src/__epilogue__.js'
				}
			}
		}
	});
// Load tasks. /////////////////////////////////////////////////////////////////////////////////////
	grunt.loadNpmTasks('grunt-concat-sourcemap');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-docker');
	grunt.loadNpmTasks('grunt-contrib-jshint');

// Custom tasks. ///////////////////////////////////////////////////////////////////////////////////
	grunt.registerTask('test-lib', 'Copies libraries for the testing facilities to use.', function() {
		var path = require('path'),
			pkg = grunt.config.get('pkg');
		grunt.log.writeln("Copied to tests/lib/: "+ [
			'build/'+ pkg.name +'.js', 
			'build/'+ pkg.name +'.js.map',
			'node_modules/creatartis-base/build/creatartis-base.js', 
			'node_modules/creatartis-base/build/creatartis-base.js.map', 
			'node_modules/ludorum/build/ludorum.js', 
			'node_modules/ludorum/build/ludorum.js.map',
			'node_modules/requirejs/require.js'
		].map(function (fileToCopy) {
			var baseName = path.basename(fileToCopy);
			grunt.file.copy('./'+ fileToCopy, './tests/lib/'+ baseName);
			return baseName;
		}).join(", ") +".");
		//TODO Use bower to retrieve jsquery, and move it to tests/lib/.
	}); // test-lib
	
// Register tasks. /////////////////////////////////////////////////////////////////////////////////
	grunt.registerTask('compile', ['concat_sourcemap:build', 'jshint:build', 'uglify:build']); 
	grunt.registerTask('test', ['compile', 'test-lib', 'karma:build']);
	grunt.registerTask('test-all', ['test', 'karma:chrome', 'karma:firefox', 'karma:iexplore']);
	grunt.registerTask('build', ['test', 'docker:build']);
	grunt.registerTask('default', ['build']);
};