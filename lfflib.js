var gmp = require('bigint');
var i64 = require('node-int64');

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
