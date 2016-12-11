// This replaces <hr>s with pretty things

var diffX = 2.5;
var diffY = 5;
var offset = 2.5;

var down = ['c', offset * 2, 0, diffX, diffY, diffX, diffY, 'c 0 0', -offset, diffY, diffX, diffY].join(' ');
var up = ['c', offset / 2, 0, offset * 2, 0, diffX, -diffY, 'c 0 0', -offset, -diffY, diffX, -diffY].join(' ');

var d = 'M 0 1 ' + down;

for (var i = 0; i < 20; i++) {
	d += ' ' + up + ' ' + down;
}

var hrs = document.querySelectorAll('hr');

for (var j = 0; j < hrs.length; j++) {
	hrs[j].outerHTML = '<svg width="205" height="12" class="hr"><path d="' + d + '"></path></svg>';
}
