/**
 * macr.ae
 *
 * Copyright (c) 2014 Callum Macrae
 */

(function () {
	'use strict';

	// Hide no-js paragraph
	var p = document.querySelectorAll('p.no-js');
	p = p[p.length - 1];

	p.classList.remove('no-js');

	// Add email address. Is this over the top?
	var emailElement = document.querySelectorAll('.add-email');
	emailElement = emailElement[emailElement.length - 1];

	if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
		addAddr();
	}

	emailElement.addEventListener('mouseover', addAddr);

	function addAddr() {
		var a = 'http://callum\u0040ma\u0063r\u002Eae';
		emailElement.href = a.replace('http://', 'ma\u0069' + 'lto:');
	}
})();