//ssbind created by mehdi salartayefeh
//it is like angularjs but easier and lighter and better

/* this section is blocked for not automate ssbindRenderng

document.querySelectorAll('input[id]').forEach(function (input) {
    window[input.id] = input.value;
    input._onchange = input.onchange;
    input.onchange = ssbindRender;
});*/

var ssbindfunc = function (obj) {

    //ignore if obj is nested in a parent node with  ssif=false
    if ( $(obj).parents(".ss-hidden").length > 0 ) {
        return;
    }

    var ssbinds = obj.getAttribute('ssbind').split(";");
    for (var b = 0; b < ssbinds.length; b++) {
        var ssbind = ssbinds[b];
        var attr = ssbind.split(":")[0].trim();
        var expr = ssbind.substr(ssbind.indexOf(':') + 1);
//                Object.assign(this, $$.data);
        var _val;
        try {
            _val = eval(expr);
            ////console.debug('val', _val)
        } catch (e) {
            console.error(e, expr)
            // _val = expr;
        }

        ////console.debug(attr, expr, _val)

        if (attr === 'value') {
            obj.value = _val;
        } else if (attr === 'text') {
            obj.innerText = _val;
        } else if (attr === 'html') {
            obj.innerHTML = _val;
        } else if (attr === 'disabled' || attr === 'checked' || attr === 'selected') {
            if (_val) obj.setAttribute(attr, _val);else obj.removeAttribute(attr);
        } else if (attr.startsWith('style.')) {
            obj.style[attr.substr(attr.indexOf('.') + 1)] = _val;
        } else {
            obj.setAttribute(attr, _val);
        }
    }
};

var ssrepeatfunc = function (obj) {
    ////console.debug('add ssrepeat');
    var ssrepeat = obj.getAttribute('ssrepeat');
    setInterval(function () {
        ssbindfunc(obj);
    }, ssrepeat==='second'?1000:ssrepeat==='minute'?60000:-1);

};

var ssforcache = {};

var ssforfunc = function (obj) {

    //ignore if obj is nested in a parent node with  ssif=false
    if ( $(obj).parents(".ss-hidden").length > 0 ) {
        return;
    }

    ////console.debug('ssfor start')
    var ssfor = obj.getAttribute('ssfor');
    var ssforreverse = obj.hasAttribute('ssforreverse');
    var ssfor1 = ssfor;

    var ssnextlevel = obj.getAttribute('ssnextlevel');

    //ssfor cache
    var sscachename = obj.getAttribute('sscachename') || ssfor;
    var _oH = "";
    if(! ssforcache.hasOwnProperty(sscachename)){
        _oH = obj.outerHTML;
        ssforcache[sscachename] = _oH;
    } else {
        _oH = ssforcache[sscachename];
    }

    var mt = ssfor.match(/(.+) with (\w+) ?(\w+)?/);
    var _ssIndex = 'ssIndex';
    var _ssObject = 'ssObject';
    if(mt){
        ssfor = mt[1];
        _ssIndex = mt[2];
        _ssObject = mt[3];
    }





    if(obj.hasAttribute('ssbind'))
        obj.setAttribute('ssbind', obj.getAttribute('ssbind').replace(/\[0\]/g,'['+_ssIndex+']'));
    /*//delete pre created
    document.querySelectorAll('[ssfor="'+ssfor+'"]').forEach(function(i, el){if(i>0) el.remove()});*/

    try {
        ssfor = eval(ssfor);
    }catch (e){
        console.error('ssfor', ssfor, e);
    }

    var oH = "";
    var thisobj;
    console.time('ssfor');
    if(typeof ssfor === "number") {
        for (var i = 0; i < ssfor; i++) {
            oH += _oH.replace(new RegExp("\\b"+_ssIndex+"\\b", 'g'), i)/*.replace(/ssfor/g , (i>0) ? '_ssfor': 'ssfor')*/;
        }
    } else if(Array.isArray(ssfor)) {
        if(ssforreverse){
            ssfor.reverse()
        }
        for (var i = 0; i < ssfor.length; i++) {
            thisobj = ssfor[i];
            oH += _oH.replace(new RegExp("\\b"+_ssIndex+"\\b", 'g'), i).replace(/*new RegExp(_ssObject+"\\[(\w*)\\]", 'g')*/  /ssObject\[(\w*)\]/g , function(match,p1){/*console.debug(match,p1) ;*/return thisobj[p1]})/*.replace(/ssfor/g , (i>0) ? '_ssfor': 'ssfor')*/;
        }
    } else if(typeof ssfor === "object"){
        for (var i in ssfor) {
            thisobj = ssfor[i];
            oH += _oH.replace(new RegExp("\\b"+_ssIndex+"\\b", 'g'), i).replace(/*new RegExp(_ssObject+"\\[(\w*)\\]", 'g')*/  /ssObject\[(\w*)\]/g , function(match,p1){/*console.debug(match,p1) ;*/return thisobj[p1]})/*.replace(/ssfor/g , (i>0) ? '_ssfor': 'ssfor')*/;
        }
    }
    console.timeEnd('ssfor');
    console.time('ssforoutrHTML');
    try {
        if(oH === ""){
            oH = "<div ssfor='"+ssfor1+"' sslevel='"+obj.getAttribute('sslevel')+"' ssemptylist='"+obj.getAttribute('ssemptylist')+"'>"+(obj.getAttribute('ssemptylist')||' ')+"</div>";
            // $(oH).addClass("hidden collapse")
        }
        obj.outerHTML = oH;

        // ssbindRenderThis2(obj)
    }catch (e){console.error(e)}
    //console.debug(obj.outerHTML)
    console.timeEnd('ssforoutrHTML');

    //call next ssbinds
    if(ssnextlevel){
        ssbindRenderLevel(ssnextlevel);
    }

    ////console.debug('ssfor end')
};

var ssiffunc = function (obj) {
    var ssif = obj.getAttribute('ssif');
    ssif = eval(ssif);
    // console.debug(ssif)
    if(!ssif) {
       // obj.remove()
        obj.classList.add('hidden');
        obj.classList.add('ss-hidden');
    } else {
        obj.classList.remove('hidden');
        obj.classList.remove('ss-hidden');
    }
};

function ssbindRender() {
    ////console.debug('ssBindRender')
    // window[this.id] = this.value;


    document.querySelectorAll('[ssfor]:not([sslevel])').forEach(ssforfunc) ;

    document.querySelectorAll('[ssbind]:not([sslevel])').forEach(ssbindfunc) ;

    document.querySelectorAll('[ssif]:not([sslevel])').forEach(ssiffunc);

    document.querySelectorAll('[ssrepeat]').forEach(ssrepeatfunc) ;
}

function ssbindRenderLevel(level, dontremove) {
    ////console.debug('ssBindRender level '+level)
    // window[this.id] = this.value;
    if(!dontremove)
    document.querySelectorAll('[ssfor][sslevel="'+level+'"]').forEach(function(el,i){if(i>0) el.remove()});

    document.querySelectorAll('[ssfor][sslevel="'+level+'"]').forEach(ssforfunc);

    document.querySelectorAll('[ssbind][sslevel="'+level+'"]').forEach(ssbindfunc);

    document.querySelectorAll('[ssif][sslevel="'+level+'"]').forEach(ssiffunc);

    document.querySelectorAll('[ssrepeat]').forEach(ssrepeatfunc) ;

}

function ssbindRenderThis(xbj) {
    ////console.debug('ssBindRenderThis')
    // window[this.id] = this.value;

    var xid = xbj.id || xbj;
    document.querySelectorAll('[ssfor="'+xid+'"]:not([sslevel])').forEach(ssforfunc) ;

    try{document.querySelectorAll('[ssbind*='+xid+']:not([sslevel])').forEach(ssbindfunc) ;}catch (e){}

    try{document.querySelectorAll('[ssfor="'+xid+'"]:not([sslevel]) [ssbind]:not([sslevel])').forEach(ssbindfunc) ;}catch (e){}

    document.querySelectorAll('[ssif]:not([sslevel])').forEach(ssiffunc);

    document.querySelectorAll('[ssrepeat]').forEach(ssrepeatfunc) ;

}

/*function ssbindRenderThis2(xbj) {
    console.debug('ssBindRenderThis2')
    // window[this.id] = this.value;

    xbj.querySelectorAll('[ssfor]').forEach(ssforfunc) ;

    try{xbj.querySelectorAll('[ssbind]').forEach(ssbindfunc) ;}catch (e){}

    // try{xbj.querySelectorAll('[ssfor="'+xid+'"] [ssbind]').forEach(ssbindfunc) ;}catch (e){}

    xbj.querySelectorAll('[ssif]').forEach(ssiffunc);
}*/

// ssbindRender();

//run ssbind after ajax loads
 /*$( document ).ajaxComplete(function() {
 ssbindRender();
 });*/

 //development
$( document ).ajaxComplete(function() {
    if(typeof developmentMode !== 'undefined' && developmentMode){
        console.log('Clear ssforcache in development mode')
        ssforcache = {};
    }
 });
