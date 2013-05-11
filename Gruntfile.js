'use strict';

module.exports = function (grunt) {
	grunt.initConfig({
		encase: {
			all: {
				enviroment: 'browser',
				separator: '\n',
				useStrict: true,
				src: [
					'src/util/*.js',
					'src/Gavia.js',
					'src/db/*.js',
					'src/store/store.js',
					'src/store/*.js',
					'src/record/*.js',
					'src/record/record.js'
				],
				dest: './Gavia.js',
				exports: 'Gavia'
			}
		},
		jshint: {
			files: ['./Gavia.js', 'Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
			options: {
				strict: false,
				multistr: true,
				bitwise: true,
				camelcase: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				laxbreak: true,
				newcap: false,
				noarg: true,
				noempty: true,
				nonew: true,
				plusplus: true,
				quotmark: true,
				undef: false,
				sub: true,
				boss: true,
				eqnull: true,
				node: true,
				es5: true
			}
		},
		uglify: {
			all: {
				files: {
					'./Gavia.min.js': ['./Gavia.js']
				}
			}
		},
		regarde: {
			all: {
				files: ['src/*.js', 'src/*/*.js'],
				tasks: ['build']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-regarde');
	grunt.loadNpmTasks('grunt-encase');

	grunt.registerTask('build', ['encase', 'uglify', 'jshint']);
	grunt.registerTask('default', ['build', 'regarde']);
};