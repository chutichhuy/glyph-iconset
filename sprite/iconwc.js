(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

// this file means to be compiled to lib

var createFn = _interopRequire(require("./icon"));

// change this if you want a different tag name
var tagName = "svg-icon";

// run
createFn(tagName)();

},{"./icon":2}],2:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var pickASrc = _interopRequire(require("./src"));

var registerElement = _interopRequireWildcard(require("document-register-element"));

/*
 * The prototype
 */
var elementProto = Object.create(HTMLElement.prototype, {
    createdCallback: {
        value: function value() {
            var _this = this;

            // get all the src element
            var srcs = this.getElementsByTagName("src");

            if (srcs.length) {
                pickASrc(Array.prototype.slice.call(srcs).map(function (s) {
                    return s.getAttribute("href");
                }), function (content) {
                    // check for shadow DOM
                    if (false && _this.createShadowRoot) {
                        _this.createShadowRoot().appendChild(content);
                    } else {
                        _this.appendChild(content);
                    }
                });
            }
        }
    }
});

// the register event stuff

module.exports = function () {
    var tag = arguments[0] === undefined ? "svg-icon" : arguments[0];

    return function () {
        return document.registerElement(tag, {
            prototype: elementProto
        });
    };
};
},{"./src":3,"document-register-element":4}],3:[function(require,module,exports){
"use strict";

/*
 * Check if this browser support SVG and createDocument()
 */
var supportsSVG = function supportsSVG() {
    // if it doesn't support createDocument()
    // it must be IE 8, this dude doesnt support SVG anyway
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") && document.implementation.createDocument;
};

/*
 * Cache register for all the sources
 */
var _srcCache = {};

/*
 * Load 
 */
var makeAjaxRequest = function makeAjaxRequest(file, cb) {
    var x = new (XMLHttpRequest || ActiveXObject)("MSXML2.XMLHTTP.3.0");
    x.open("GET", file, 1);
    //
    x.onreadystatechange = function () {
        if (x.readyState > 3) {
            if (x.status < 400) {
                cb(x.responseText);
            } else {
                cb(null);
            }
        }
        return;
    };
    x.send();
    return file;
};

/*
 * Create an alternative document object
 * @param content -  String
 */
var createDoc = function createDoc(content) {
    var srcDoc = document.implementation.createHTMLDocument("http://www.w3.org/1999/xhtml", "html", null);

    var body = srcDoc.createElement("body");
    body.innerHTML = content;

    srcDoc.documentElement.appendChild(body);
    return srcDoc;
};

/*
 * Make a HTTP request for a file if needs to.
 * Return a document object
 * @param file - string
 * @param cb - function
 */
var loadSrc = function loadSrc(file, cb) {
    return _srcCache[file] ? cb(createDoc(_srcCache[file])) : makeAjaxRequest(file, function (content) {
        if (content) {
            var doc = createDoc(content);
            _srcCache[file] = content;
            cb(doc);
        } else {
            cb(null);
        }
    });
};

/*
 * Recursively import nodes from an element to another
 * This exists because IE9 and below doesnt support innerHTML on SVGElement
 */
var importNodes = function importNodes(orig, dest) {
    for (var i = 0; i < orig.childNodes.length; i++) {
        dest.appendChild(dest.ownerDocument.importNode(orig.childNodes[i], true));
    };
    return dest;
};

/*
 * Create a SVG element
 * @param element - the original SVG element
 */
var createSvgElement = function createSvgElement(element) {
    var svg = importNodes(element, document.createElementNS("http://www.w3.org/2000/svg", "svg"));

    // assign viewBox
    if (element.getAttribute("viewBox")) {
        svg.setAttribute("viewBox", element.getAttribute("viewBox"));
    }

    // namespace and stuff
    svg.setAttribute("xmlns", element.getAttribute("xmlns") ? element.getAttribute("xmlns") : "http://www.w3.org/2000/svg");

    svg.setAttribute("version", element.getAttribute("version") ? element.getAttribute("version") : "1.1");

    return svg;
};

/*
 * Picks an icon source, fallbacks to other if one fails
 *
 * @param srcs - Array of source URL
 * @param callback - A callback function
 */

module.exports = function (srcs, callback) {
    var isSvg = function isSvg(url) {
        var parts = url.split("#");
        return /\.svg/.test(parts[0]);
    };

    var innerPicker = (function (_innerPicker) {
        var _innerPickerWrapper = function innerPicker() {
            return _innerPicker.apply(this, arguments);
        };

        _innerPickerWrapper.toString = function () {
            return _innerPicker.toString();
        };

        return _innerPickerWrapper;
    })(function (c) {
        if (c >= srcs.length) {
            return void 0;
        }

        //
        var nex = c + 1;
        var src = srcs[c];
        var isSvgSupported = supportsSVG();

        if (isSvg(src)) {
            if (!isSvgSupported) {
                return innerPicker(nex);
            } else {
                var _ret = (function () {
                    var parts = src.split("#");
                    var anchor = parts[1];
                    return {
                        v: loadSrc(parts[0], function (doc) {
                            if (doc) {
                                var ele;

                                // check if the anchor matches any element in the document
                                // if not, then move on
                                if (anchor) {
                                    ele = doc.getElementById(anchor);

                                    if (!ele) {
                                        return innerPicker(nex);
                                    }
                                }

                                return callback(createSvgElement(anchor ? ele : doc.getElementsByTagName("svg")[0]));
                            }
                            return innerPicker(nex);
                        })
                    };
                })();

                if (typeof _ret === "object") return _ret.v;
            }
        } else {
            var img = document.createElement("img");
            img.src = src;
            img.onerror = function () {
                innerPicker(nex);
            };

            img.onload = function () {
                callback(this);
            };
            return;
        }
    });

    // start the loop
    innerPicker(0);
};
},{}],4:[function(require,module,exports){
/*! (C) WebReflection Mit Style License */
(function(e,t,n,r){"use strict";function rt(e,t){for(var n=0,r=e.length;n<r;n++)dt(e[n],t)}function it(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],nt(r,b[ot(r)])}function st(e){return function(t){j(t)&&(dt(t,e),rt(t.querySelectorAll(w),e))}}function ot(e){var t=e.getAttribute("is"),n=e.nodeName.toUpperCase(),r=S.call(y,t?v+t.toUpperCase():d+n);return t&&-1<r&&!ut(n,t)?-1:r}function ut(e,t){return-1<w.indexOf(e+'[is="'+t+'"]')}function at(e){var t=e.currentTarget,n=e.attrChange,r=e.prevValue,i=e.newValue;Q&&t.attributeChangedCallback&&e.attrName!=="style"&&t.attributeChangedCallback(e.attrName,n===e[a]?null:r,n===e[l]?null:i)}function ft(e){var t=st(e);return function(e){X.push(t,e.target)}}function lt(e){K&&(K=!1,e.currentTarget.removeEventListener(h,lt)),rt((e.target||t).querySelectorAll(w),e.detail===o?o:s),B&&pt()}function ct(e,t){var n=this;q.call(n,e,t),G.call(n,{target:n})}function ht(e,t){D(e,t),et?et.observe(e,z):(J&&(e.setAttribute=ct,e[i]=Z(e),e.addEventListener(p,G)),e.addEventListener(c,at)),e.createdCallback&&Q&&(e.created=!0,e.createdCallback(),e.created=!1)}function pt(){for(var e,t=0,n=F.length;t<n;t++)e=F[t],E.contains(e)||(F.splice(t,1),dt(e,o))}function dt(e,t){var n,r=ot(e);-1<r&&(tt(e,b[r]),r=0,t===s&&!e[s]?(e[o]=!1,e[s]=!0,r=1,B&&S.call(F,e)<0&&F.push(e)):t===o&&!e[o]&&(e[s]=!1,e[o]=!0,r=1),r&&(n=e[t+"Callback"])&&n.call(e))}if(r in t)return;var i="__"+r+(Math.random()*1e5>>0),s="attached",o="detached",u="extends",a="ADDITION",f="MODIFICATION",l="REMOVAL",c="DOMAttrModified",h="DOMContentLoaded",p="DOMSubtreeModified",d="<",v="=",m=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,g=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],y=[],b=[],w="",E=t.documentElement,S=y.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},x=n.prototype,T=x.hasOwnProperty,N=x.isPrototypeOf,C=n.defineProperty,k=n.getOwnPropertyDescriptor,L=n.getOwnPropertyNames,A=n.getPrototypeOf,O=n.setPrototypeOf,M=!!n.__proto__,_=n.create||function vt(e){return e?(vt.prototype=e,new vt):this},D=O||(M?function(e,t){return e.__proto__=t,e}:L&&k?function(){function e(e,t){for(var n,r=L(t),i=0,s=r.length;i<s;i++)n=r[i],T.call(e,n)||C(e,n,k(t,n))}return function(t,n){do e(t,n);while((n=A(n))&&!N.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),P=e.MutationObserver||e.WebKitMutationObserver,H=(e.HTMLElement||e.Element||e.Node).prototype,B=!N.call(H,E),j=B?function(e){return e.nodeType===1}:function(e){return N.call(H,e)},F=B&&[],I=H.cloneNode,q=H.setAttribute,R=H.removeAttribute,U=t.createElement,z=P&&{attributes:!0,characterData:!0,attributeOldValue:!0},W=P||function(e){J=!1,E.removeEventListener(c,W)},X,V=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,10)},$=!1,J=!0,K=!0,Q=!0,G,Y,Z,et,tt,nt;O||M?(tt=function(e,t){N.call(t,e)||ht(e,t)},nt=ht):(tt=function(e,t){e[i]||(e[i]=n(!0),ht(e,t))},nt=tt),B?(J=!1,function(){var e=k(H,"addEventListener"),t=e.value,n=function(e){var t=new CustomEvent(c,{bubbles:!0});t.attrName=e,t.prevValue=this.getAttribute(e),t.newValue=null,t[l]=t.attrChange=2,R.call(this,e),this.dispatchEvent(t)},r=function(e,t){var n=this.hasAttribute(e),r=n&&this.getAttribute(e),i=new CustomEvent(c,{bubbles:!0});q.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[f]=i.attrChange=1:i[a]=i.attrChange=0,this.dispatchEvent(i)},s=function(e){var t=e.currentTarget,n=t[i],r=e.propertyName,s;n.hasOwnProperty(r)&&(n=n[r],s=new CustomEvent(c,{bubbles:!0}),s.attrName=n.name,s.prevValue=n.value||null,s.newValue=n.value=t[r]||null,s.prevValue==null?s[a]=s.attrChange=0:s[f]=s.attrChange=1,t.dispatchEvent(s))};e.value=function(e,o,u){e===c&&this.attributeChangedCallback&&this.setAttribute!==r&&(this[i]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",s)),t.call(this,e,o,u)},C(H,"addEventListener",e)}()):P||(E.addEventListener(c,W),E.setAttribute(i,1),E.removeAttribute(i),J&&(G=function(e){var t=this,n,r,s;if(t===e.target){n=t[i],t[i]=r=Z(t);for(s in r){if(!(s in n))return Y(0,t,s,n[s],r[s],a);if(r[s]!==n[s])return Y(1,t,s,n[s],r[s],f)}for(s in n)if(!(s in r))return Y(2,t,s,n[s],r[s],l)}},Y=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,at(o)},Z=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[r]=function(n,r){p=n.toUpperCase(),$||($=!0,P?(et=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new P(function(r){for(var i,s,o=0,u=r.length;o<u;o++)i=r[o],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,Q&&s.attributeChangedCallback&&i.attributeName!=="style"&&s.attributeChangedCallback(i.attributeName,i.oldValue,s.getAttribute(i.attributeName)))})}(st(s),st(o)),et.observe(t,{childList:!0,subtree:!0})):(X=[],V(function E(){while(X.length)X.shift().call(null,X.shift());V(E)}),t.addEventListener("DOMNodeInserted",ft(s)),t.addEventListener("DOMNodeRemoved",ft(o))),t.addEventListener(h,lt),t.addEventListener("readystatechange",lt),t.createElement=function(e,n){var r=U.apply(t,arguments),i=""+e,s=S.call(y,(n?v:d)+(n||i).toUpperCase()),o=-1<s;return n&&(r.setAttribute("is",n=n.toLowerCase()),o&&(o=ut(i.toUpperCase(),n))),Q=!t.createElement.innerHTMLHelper,o&&nt(r,b[s]),r},H.cloneNode=function(e){var t=I.call(this,!!e),n=ot(t);return-1<n&&nt(t,b[n]),e&&it(t.querySelectorAll(w)),t});if(-2<S.call(y,v+p)+S.call(y,d+p))throw new Error("A "+n+" type is already registered");if(!m.test(p)||-1<S.call(g,p))throw new Error("The type "+n+" is invalid");var i=function(){return f?t.createElement(l,p):t.createElement(l)},a=r||x,f=T.call(a,u),l=f?r[u].toUpperCase():p,c=y.push((f?v:d)+p)-1,p;return w=w.concat(w.length?",":"",f?l+'[is="'+n.toLowerCase()+'"]':l),i.prototype=b[c]=T.call(a,"prototype")?a.prototype:_(H),rt(t.querySelectorAll(w),s),i}})(window,document,Object,"registerElement");
},{}]},{},[3,2,1]);
