module.exports = function (grunt) {
	var path = require('path');

	grunt.initConfig({
		bower: {
			install: {
				options: {
					targetDir: './vendor',
					layout: 'byType',
					install: true,
					verbose: false,
					cleanTargetDir: true,
					cleanBowerDir: true,
					layout: function (type, component) {
						return component;
					}
				}
			}
		},
	});
	grunt.loadNpmTasks('grunt-bower-task');
};