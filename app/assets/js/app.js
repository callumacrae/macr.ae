'use strict';

require('prismjs');
var whenScroll = require('when-scroll');
var isTouch = require('touch-screen');

// Add email address. Is this over the top?
var emailElement = document.querySelectorAll('.add-email');
emailElement = emailElement[emailElement.length - 1];

emailElement.addEventListener('mouseover', addAddr);

function addAddr() {
	var a = 'http://callum\u0040ma\u0063r\u002Eae';
	emailElement.href = a.replace('http://', 'ma\u0069' + 'lto:');
}

if (isTouch()) {
	addAddr();

	document.documentElement.classList.add('touch');
}

document.documentElement.classList.add('js');
document.documentElement.classList.remove('no-js');

var social = document.querySelector('.social');
whenScroll(['within 500px of', social], function () {
	loadScript('https://connect.facebook.net/en_GB/all.js#xfbml=1&appId=251120905643');
	window.___gcfg = {lang: 'en-GB'};
	loadScript('https://apis.google.com/js/plusone.js');
	loadScript('https://platform.twitter.com/widgets.js');
});

function loadScript(url) {
	var first, js, d = document, s = 'script';

	first = d.getElementsByTagName(s)[0];
	js = d.createElement(s);
	js.src = url;
	first.parentNode.insertBefore(js, first);
}