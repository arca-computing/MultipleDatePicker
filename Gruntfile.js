/*global module:false*/
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean:{
            build: {
                src: ['dist/*.css', 'dist/*.js']
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            js: {
                src: [
                    'multipleDatePicker.js'
                ],
                dest: 'dist/multipleDatePicker.min.js'
            }
        },
        uglify: {
            options: {

            },
            dist: {
                src: 'dist/multipleDatePicker.min.js',
                dest: 'dist/multipleDatePicker.min.js'
            }
        },

        jshint: {
            options: {
                curly: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: false,
                boss: true,
                eqnull: true,
                devel:true,
                browser: true,
                globals: {
                    '_': true,
                    'angular': true,
                    'moment': true
                }
            },
            src: 'multipleDatePicker.js'
        },

        less: {
            dist: {
                options: {
                    cleancss: true,
                    report: 'gzip'
                },
                files: [{
                    expand: true,
                    cwd: '',
                    src: '*.less',
                    dest: 'dist/',
                    ext: '.css'
                }]
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: 'dist/*.css',
                    dest: ''
                }]
            }
        },

        watch: {
            js: {
                files: ['multipleDatePicker.js'],
                tasks: ['jshint', 'concat:js', 'uglify']
            },
            less: {
                files: ['*.less'],
                tasks: ['less', 'autoprefixer']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'clean', 'concat:js', 'uglify', 'less', 'autoprefixer']);
    grunt.registerTask('dev', ['jshint', 'clean', 'concat:js', 'uglify', 'less', 'autoprefixer', 'watch']);
};
