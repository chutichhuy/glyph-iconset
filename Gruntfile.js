module.exports = function(grunt) {
    
    grunt.initConfig({
        exec: {
            list: {
                command: 'node generator/generate-list.js',
                stdout: true
            },
            sprite: {
                command: 'node generator/generate.js -f sprite/list.csv -o sprite/sprite.svg -s sprite/sample.html -w sprite/sample-iwc.html',
                stdout: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.registerTask('default', ['exec']);
}
