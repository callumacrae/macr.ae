'use strict';

require('prismjs');

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
document.documentElement.classList.remove('js');
