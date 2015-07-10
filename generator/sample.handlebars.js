var Handlebars = require("handlebars");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sample'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "            <li>\n                <svg xmlns=\"http://www.w3.org/2000/svg\" class=\""
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n                    <use xlink:href=\"sprite.svg#"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" />\n                </svg> \n                <input type=\"text\" onClick=\"this.select();\" value=\"&#x3C;svg xmlns=&#x22;http://www.w3.org/2000/svg&#x22; class=&#x22;"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "&#x22;&#x3E;&#x3C;use xlink:href=&#x22;sprite.svg#"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "&#x22; /&#x3E;&#x3C;/svg&#x3E;\" />\n            </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<html>\n    <head>\n        <title>Sample</title>\n        <style>\n            body {\n                font-family:Arial, sans-serif;\n            }\n            h3 {\n                margin-left:10px;\n            }\n            .icon-grid {\n                margin: 0;\n                padding: 0;\n                list-style: none;\n            }\n            .icon-grid > li {\n                display:inline-block;\n                margin: 10px;\n                padding: 10px;\n                width: 104px;\n                height: 124px;\n                text-align:center;\n                border:1px solid #dce5e7;\n            }\n            .icon-grid  svg {\n                width: 64px;\n                height: 64px;\n                margin: 10px;\n            }\n            .icon-grid  input {\n                width: 64px;\n            }\n        </style>\n    </head>\n    <body>\n        <ul class=\"icon-grid\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.icons : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </ul>\n</body>\n";
},"useData":true});
