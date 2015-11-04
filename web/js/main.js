/*
 *
 * mads - version 2.00.01
 * Copyright (c) 2015, Ninjoe
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://en.wikipedia.org/wiki/MIT_License
 * https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
 */
var mads = function () {
    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }

    /* Unique ID on each initialise */
    this.id = this.uniqId();

    /* Tracked tracker */
    this.tracked = [];

    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];

    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];

    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');

    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';
};

/* Generate unique ID */
mads.prototype.uniqId = function () {

    return new Date().getTime();
};

/* Link Opner */
mads.prototype.linkOpener = function (url) {

    if(typeof url != "undefined" && url !=""){
        if (typeof mraid !== 'undefined') {
            mraid.open(url);
        }else{
            window.open(url);
        }
    }
};

/* tracker */
mads.prototype.tracker = function (tt, type, name) {
    console.log(type);
    /* 
     * name is used to make sure that particular tracker is tracked for only once
     * there might have the same type in different location, so it will need the name to differentiate them
     */
    name = name || type;

    if ( typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1 ) {
        for (var i = 0; i < this.custTracker.length; i++) {
            var img = document.createElement('img');

            /* Insert Macro */
            var src = this.custTracker[i].replace('{{type}}', type);
            src = src.replace('{{tt}}', tt);
            /* */
            img.src = src + '&' + this.id;

            img.style.display = 'none';
            this.bodyTag.appendChild(img);

            this.tracked.push(name);
        }
    }
};

/* Load JS File */
mads.prototype.loadJs = function (js, callback) {
    var script = document.createElement('script');
    script.src = js;

    if (typeof callback != 'undefined') {
        script.onload = callback;
    }

    this.headTag.appendChild(script);
};

/* Load CSS File */
mads.prototype.loadCss = function (href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');

    this.headTag.appendChild(link);
};

/*
 *
 * Unit Testing for mads
 *
 */
var testunit = function () {
    var app = new mads();

    console.log(typeof app.bodyTag != 'undefined');
    console.log(typeof app.headTag != 'undefined');
    console.log(typeof app.custTracker != 'undefined');
    console.log(typeof app.path != 'undefined');
    console.log(typeof app.contentTag != 'undefined');

    app.loadJs('https://code.jquery.com/jquery-1.11.3.min.js',function () {
        console.log(typeof window.jQuery != 'undefined');
    });

    app.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css');

    app.contentTag.innerHTML =
        '<div class="container"><div class="jumbotron"> \
            <h1>Hello, world!</h1> \
            <p>...</p> \
            <p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a></p> \
        </div></div>';

    app.custTracker = ['http://www.tracker.com?type={{type}}&tt={{tt}}','http://www.tracker2.com?type={{type}}'];

    app.tracker('CTR', 'test');
    app.tracker('E','test','name');

    app.linkOpener('https://www.facebook.com/LifebuoyMalaysia');
};

var msgObj = {
    headerText : 'baharu',
    tabletTextOnRegGerms : 'Kuman sekarang',
    tabletTextOnBlueGerms : 'Kuman zaman dulu',
    textForDrop : '<< Klik untuk<br/><span class="with-margin">ketahui</span><br/><span class="with-margin">rahsia kita!</span>',
    redText : '10x perlindungan kuman*<br/>Lebih penjagaan kulit',
    greyText : 'dengan activ naturol shield',
    footerText : '*Berbanding sabun biasa tanpa bahan aktif.<br/>Berdasarkan ujian makmal terhadap penunjuk organisma.'
};

var LifeBuoyAd = function () {
    // initialize MADS SDK
    this.sdk = new mads();
    var self = this;

    // Load local css
    this.sdk.loadCss( this.sdk.path + 'css/style.css');

    // Load local js
    this.sdk.loadJs( this.sdk.path + 'js/jquery.js', function () {
        self.renderFirstScreen();
    });

    this.preloadImages(this.sdk.bodyTag);
};

LifeBuoyAd.prototype.renderFirstScreen = function () {
    var self = this;
    var content = $('<div id="content"></div>');
    var headerText = $('<div id="header-text"></div>');
    var bg = $('<div id="bg"></div>');
    var leaves = $('<div id="leaves"></div>');
    var drop = $('<div id="drop"></div>');
    var textForDrop = $('<div id="text-for-drop"></div>');
    var people = $('<div id="people"></div>');
    var tablet = $('<div id="tablet"></div>');
    var footer = $('<div id="footer"></div>');
    var redText = $('<div id="red-text"></div>');
    var greyText = $('<div id="grey-text"></div>');

    $(this.sdk.contentTag).append(content);

    headerText.html(msgObj.headerText);
    content.append(headerText);

    content.append(leaves);
    leaves.append(textForDrop);
    textForDrop.html(msgObj.textForDrop);

    content.append(bg);
    content.append(drop);
    content.append(people);

    redText.html(msgObj.redText);
    content.append(redText);
    greyText.html(msgObj.greyText);
    content.append(greyText);

    content.append(tablet);
    tablet.append('<p class="on-blue-germs">' + msgObj.tabletTextOnBlueGerms + '</p>' +
    '<p class="on-red-germs">' + msgObj.tabletTextOnRegGerms + '</p>');

    footer.html(msgObj.footerText);
    content.append(footer);

    drop.click(function () {
        textForDrop.remove();

        $(this).animate({
            top: '0'
        }, 1000, createShiningDrop);
    });

    function createShiningDrop () {
        var shiningDrop = $('<div id="shining-drop"></div>');
        content.append(shiningDrop);

        tablet.animate({
            opacity: '0'
        },1000, null);

        var doctor = $('<div id="doctor"></div>');
        content.append(doctor);

        var bottle = $('<div id="bottle"></div>');
        content.append(bottle);
        bottle.animate({
            opacity: '1'
        },1000, null);

        setTimeout(function () {
            people.animate({
                opacity: '0'
            },1000, null);

            var btn = $('<a href="#" target="_blank" id="btn"></a>');
            content.append(btn);
            btn.animate({
                opacity: '1'
            },1000, null);
            $(btn).on('click', function (e) {
                e.preventDefault();
                self.sdk.linkOpener('https://www.facebook.com/LifebuoyMalaysia');
            })
            var shiningBottle = $('<div id="shining-bottle"></div>');
            content.append(shiningBottle);
            shiningBottle.animate({
                opacity: '1'
            },1000, null);
        }, 10);
    }
};


LifeBuoyAd.prototype.preloadImages = function (parent) {
    var script = document.createElement('SCRIPT');
    var str = '';

    str = str +
    'var pic1 = new Image();' +
    'var pic2 = new Image();' +
    'var pic3 = new Image();' +
    'var pic4 = new Image();' +
    'var pic5 = new Image();' +
    'var pic6 = new Image();' +
    'var pic7 = new Image();' +
    'var pic8 = new Image();' +
    'var pic9 = new Image();' +
    'var pic10 = new Image();' +
    'pic1.src="img/bg1.png";' +
    'pic2.src="img/bottle1.png";' +
    'pic3.src="img/bottle-pure1.png";' +
    'pic4.src="img/btn1.png";' +
    'pic5.src="img/doctor1.png";' +
    'pic6.src="img/drop1.png";' +
    'pic7.src="img/leaves1.png";' +
    'pic8.src="img/people1.png";' +
    'pic9.src="img/shining-drop1.png";' +
    'pic10.src="img/tablet1.png";';

    script.innerHTML = str;

    parent.appendChild(script);
};

var ad = new LifeBuoyAd();