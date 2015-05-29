(function (requestAnimationFrame, active) { 
    // create a sprite svg element and hide it somewhere
    var createSpriteElement = function (url, svgText) {
        var wrap            = document.createElement('span');
        wrap.innerHTML      = svgText;
        wrap.style.display  = 'none';

        // append
        document.body.appendChild(wrap);
        return;
    };
    
    // load sprite svg using AJAX
    var loadSprite = function (file, cb) {
        var x = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
        x.open('GET', file, 1);
        // 
        x.onreadystatechange = function () {
            if (x.readyState > 3) {
                createSpriteElement(file, x.responseText);
                cb();
            }
            return;
        };
        x.send();
        return file;
    }; 
    
    var modifyElement = function (e, uri) {
        return (function (symbol) {
            if (!symbol) {
                return void(0);
            } else {
                e.parentNode.setAttribute('viewBox', symbol.getAttribute('viewBox'));
                e.parentNode.replaceChild((function (nodes, frag) {
                    Array.prototype.forEach.call(nodes, function (n) {
                        frag.appendChild(n.cloneNode(true));
                    });
                    return frag;
                })(symbol.childNodes, document.createDocumentFragment()), e);
                return void(0);
            }
        })(document.getElementById(uri));
    }; 

    var createScanner = function (loaded) {
        return function () {
            (function scanEle(n, l, counter) {
                return counter >= n.length      ?
                    
                    (function () {
                        // setup next scanner
                        requestAnimationFrame(createScanner(l));
                        return void(0);
                    })()                        :

                    (function (href) {
                        return (href[0] == '#')                             ?
                            modifyElement(n[counter], href.substring(1))    : 
                            (function (parts) {
                                return (function (uri, hash) {
                                    // if the file hasn't been loaded before,
                                    // load it into DOM
                                    scanEle(n                               ,
                                        l.indexOf(uri) > -1                 ?
                                        (function () {
                                            modifyElement(n[counter], hash);
                                            return l;
                                        })()                                :
                                        (function (e) {
                                            return l.concat([
                                                loadSprite(uri, function () {
                                                    // now modify the e element
                                                    return modifyElement(e, hash);
                                                })
                                            ]);
                                        })(n[counter])                      ,
                                        (counter + 1)
                                    );
                                    return void(0);
                                })(parts[0], parts[1]);

                            })(href.split('#'));

                    })(n[counter].getAttribute('xlink:href'));

            })(document.getElementsByTagName('use'), loaded, 0); 
        };
    };
    
    return active ? createScanner([])() : void(0);
})(
    (window.requestAnimationFrame || function (fn) {
            window.setTimeout(fn, 300);
        }),
    (
        /MSIE\b/.test(navigator.userAgent)       ||
	    /Trident\b/.test(navigator.userAgent)    || 
        /AppleWebKit\/(\d+)/.test(navigator.userAgent)  
    )
);