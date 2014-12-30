'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        browserify: {
            vendor: {
                src: [],
                dest: 'public/js/vendor.js',
                options: {
                    require: ['angular'],
                    // alias: [
                    //     './lib/moments.js:momentWrapper', //can alias file names
                    //     'events:evt' //can alias modules
                    // ]
                }
            },
            client: {
                src: ['client/app/**/*.js'],
                dest: 'public/js/app.js',
                options: {
                    external: ['angular'],
                }
            }
        },
        concat: {
            'public/js/main.js': ['public/js/vendor.js', 'public/js/app.js']
        },
        nodeunit: {
            files: ['test/**/*_test.js'],
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['lib/**/*.js','server/**/*.js', 'main.js']
            },
            test: {
                src: ['test/**/*.js']
            },
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib', 'nodeunit']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'nodeunit']
            },
        },
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-browserify');
    
    // Default task.
    grunt.registerTask('default', ['jshint', 'nodeunit', 'browserify', 'concat']);
};
