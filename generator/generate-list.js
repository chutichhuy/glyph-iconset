var fs = require("fs");

var svgPath = "svg";

fs.readdir(svgPath, function (err, files) {
    if (err) {
        console.log("Error!");
        return;
    }

    var names = files.map(function (item) {
        // strip prefix and file extension
        return item.substring(
            "si-glyph-".length, 
            (item.length - ".svg".length)
        );
    });

    // write to file
    fs.writeFileSync("sprite/list.csv", names.join("\n"));
});

