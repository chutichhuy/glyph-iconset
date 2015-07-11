var fs  = require('fs');
var ssg = require("svg-sprite-generator");
var program = require("commander");

//
var Handlebars    = require('handlebars');
var sampleTemplate = require('./sample.handlebars.js');
var sampleWcTemplate = require('./sample-iwc.handlebars.js');

program.version("0.0.1")
    .option("-l, --list <list>", "List of icons you wanna make sprite file")
    .option("-f, --file <file>", "A one-column CSV file, which specifies the icons you wanna make a sprite of")
    .option("-o, --output <output>", "Path to the ouput directory")
    .option("-s, --sample <sample>", "Path to the sample html file")
    .option("-w, --samplewc <samplewc>", "Path to the sample html file which uses web component")
    .parse(process.argv);


if (!program.output) {
    console.log("No output path specified. Nothing generated.");
} else if (!program.file && !program.list) { 
    console.log("No list of icons specified. Nothing generated.");
} else {
    // now generate
    var svgPath = "svg";
    
    var icons = ["list", "file"].map(function (item) {
        if (!program[item]) {
            return;
        }

        switch (item) {
            case "list":
                return program.list.split(",").map(function (i) {
                    return i.trim();
                });
                break;
            case "file":
                var ctn = fs.readFileSync(program.file).toString('utf8');
                
                if (ctn) {
                    return ctn.split("\n").map(function (i) {
                        return i.trim();
                    });
                } else {
                    return [];
                }
        }
    }).reduce(function (prev, curr) {
        return prev.concat(curr);
    }, []);
    
    // now generate
    ssg.spriteFromFiles(icons.map(function (item) {
        return svgPath + '/si-glyph-' + item + '.svg';
    })).then(function (sprite) {
        // write to file
        fs.writeFileSync(program.output, sprite);
    });

    // get the sprite file name
    var spriteName = program.output.split("/").pop();
    
    // write the sample
    if (program.sample) {
        // write the sample file
        var sampleHtml = Handlebars.templates.sample({icons: icons.map(function (item) {
            return {name: "si-glyph-" + item};
        }), spriteFile: spriteName});

        fs.writeFileSync(program.sample, sampleHtml);
    }

    if (program.samplewc) {
        var sampleWcHtml = Handlebars.templates["sample-iwc"]({icons: icons.map(function (item) {
            return {name: "si-glyph-" + item};
        }), spriteFile: spriteName});
        
        var parts = program.samplewc.split("/");
        parts.pop();
        parts.push("iconwc.js");

        // copy the web component js file 
        fs.writeFileSync(
            parts.join("/"), 
            fs.readFileSync("./node_modules/icon-webcomponent/build/iconwc.js").toString("utf8")
        );

        fs.writeFileSync(program.samplewc, sampleWcHtml);
    }
}
