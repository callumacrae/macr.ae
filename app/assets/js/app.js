'use strict';

require('prismjs');
require('./hr');
var whenScroll = require('when-scroll');
var isTouch = require('touch-screen');

if (isTouch()) {
	document.documentElement.classList.add('touch');
}

document.documentElement.classList.add('js');
document.documentElement.classList.remove('no-js');

var social = document.querySelector('.social');
whenScroll(['within 500px of', social], loadSocial);
window.loadSocial = loadSocial;

function loadSocial() {
	loadSocial = function () {};

	loadScript('https://connect.facebook.net/en_GB/all.js#xfbml=1&appId=251120905643');
	window.___gcfg = {lang: 'en-GB'};
	loadScript('https://apis.google.com/js/plusone.js');
	loadScript('https://platform.twitter.com/widgets.js');
}

function loadScript(url) {
	var first, js, d = document, s = 'script';

	first = d.getElementsByTagName(s)[0];
	js = d.createElement(s);
	js.src = url;
	first.parentNode.insertBefore(js, first);
}