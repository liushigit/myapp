module.exports = function (grunt) {
	grunt.initConfig({
		bower: {
			target: {
				rjsConfig: 'public/config.js'
			}
		}
	  , uglify: {
	  		my_target: {
	  			options: {

	  			}
	  		  , files: {
	  		  		'public/js/lib/hlt.js': 
	  		  			['bower_components/highlight/build/highlight.pack.js']
				}
	  		}
	  	}
	});

	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.registerTask('default', ['bower']);
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('ugly', ['uglify']);

}
