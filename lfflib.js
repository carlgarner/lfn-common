var gmp = require('bigint');
var i64 = require('node-int64');
var sprintf = require('sprintf-js').sprintf;

exports.pattern2hex = function(pattern) {
	var parts = pattern.split('.');
	
	if(parts.length != 4) {
		return pattern;
	}
	
	var hex = sprintf("0x%03x%03x%04x%03x%03x", 0, new Number(parts[0]), new Number(parts[1]), new Number(parts[2]), new Number(parts[3]));
	
	return hex;
}

exports.hex2pattern = function(hex) {
	if(hex.indexOf('.') > 0) {
		return hex;
	}
	
	if(hex.substr(0, 2) == '0x') {
		hex = hex.substr(2);
	}
	
	var segment = parseInt(hex.substr(3, 3), 16);
	var shelf = parseInt(hex.substr(6, 4), 16);
	var book = parseInt(hex.substr(10, 3), 16);
	var page = parseInt(hex.substr(13, 3), 16);
	
	return segment + '.' + shelf + '.' + book + '.' + page;
}

exports.pen2hex = function(pen) {
	if(pen.length != 14) {
		return 'Not a valid pen';
	}
	
	var parts = pen.split('-');
	
	if(parts.length != 4) {
		return 'Not a valid pen address';
	}
	
	var addr = pen.replace(/-/g, '');
	var man = adecode(addr.substr(0, 3));
	var ser = adecode(addr.substr(3, 6));
	var chk = adecode(addr.substr(9, 2));
	var hex = sprintf("0x%08x%08x", man, ser);
	
	var h64 = new i64(hex);
	var bii = gmp(h64);
	var sum = bii.mod(877).toString();

	if(sum != chk) {
		return 'Invalid Pen ID - Incorrect Checksum';
	}
	
	return hex;
}

exports.hex2pen = function(hex) {
	var p1 = hex.substr(2, 8);
	var p2 = hex.substr(10, 8);

	var s1 = p1.replace(/[^a-f0-9]/gi, '');
	s1 = parseInt(s1, 16);
	var maa = acode(s1);
	var man = maa.substr(3, 3);

	var s2 = p2.replace(/[^a-f0-9]/gi, '');
	s2 = parseInt(s2, 16);
	var ser = acode(s2);
	var ser1 = ser.substr(0, 3);
	var ser2 = ser.substr(3, 6);

	var h64 = new i64(hex);
	var bii = gmp(h64);
	var biimod = bii.mod(877);
	var biima = acode(biimod);
	var chk = biima.substr(4, 2);

	return man + '-' + ser1 + '-' + ser2 + '-' + chk;
}

function adecode(s) {
	var code_base = "ABCDEFGHJKMNPQRSTUWXYZ23456789";
	var code_b = 30;
	var sum = 0;
	
	for(var i = 0; i < s.length; i++) {
		var c = s.substr(i, 1);
		var pos = code_base.indexOf(c);
		
		sum = sum * code_b + pos;
	}
	
	return sum;
}

function acode(v) {
	var code_base = "ABCDEFGHJKMNPQRSTUWXYZ23456789";
	var code_b = 30;
	var s = "";
	var a = "AAAAAA";

	if(v < 0) {
		v += 1754;
	}

	while(v > 0) {
		var rest = v % code_b;
		s = code_base.substr(rest, 1) + s;
		v = (v - rest) / code_b;
	}

	return (a.substr(0, (6 - s.length)) + s);
}
