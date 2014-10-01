module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'src/*.js']
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/index.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        concat: {
            option: {
                separator: ';'
            },
            dist: {
                src: ['src/index.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        watch: {
            files: ['src/*.js'],
            tasks: ['concat', 'uglify'],
            options: {
                spawn: false,
                interrupt: true,
                debounceDelay: 100
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
