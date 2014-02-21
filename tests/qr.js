var qrcode = require("../lib/qrcode"),
	fs = require('fs');

var qr = qrcode.qrcode(4, 'M');
qr.addData("hellloooooo");
qr.make();
var data = new Buffer(qr.createImgData(4));
fs.open("./qr.gif", 'w', function(err, fd) {
    if (err) {
        throw 'error opening file: ' + err;
    } else {
        fs.write(fd, data, 0, data.length, null, function(err) {
        if (err) throw 'error writing file: ' + err;
            fs.close(fd, function() {
            	console.log('file written');
            })
        });
    }
});