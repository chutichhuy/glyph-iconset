/*
 * This script generates the file "list.txt".
 * Nothing more.
 */
var fs = require('fs');

fs.readdir(__dirname + '/svg', function (err, files) {
    
    if (err) {
        console.log('err', err);
        return;
    }

    fs.writeFileSync(
        __dirname + '/list.txt',
        
        // all file name into a string
        files.filter(function (f) {
            return /svg/.test(f);
        }).map(function (f) {
            return f.substring(0, (f.length - 4));
        }).join("\n")
    );
});
