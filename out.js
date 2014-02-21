var fs = require('fs'),
    sys = require('sys'),
    colors = require( "colors");

module.exports.image =  function(resp,type,path){
		  				fs.readFile(path, "binary", function (err, data) {
					     	if (err) {
					              resp.writeHead(500, {'Content-Type': 'text/plain'});
				              	  resp.end();
				          	} else {
				              	  resp.writeHead(200, {'Content-Type': type});
				              	  resp.write(data, "binary");
				              	  resp.end();
				              	  sys.log("return:" + path.green);
				          }
})}


module.exports.err =  function(resp,code,data){
	resp.writeHead(code, {'Content-Type': 'text/plain'});
	resp.end(data);	  				
}


module.exports.json =  function(resp,code,data){
	resp.writeHead(code, {'Content-Type': 'text/plain'});
	resp.end(JSON.stringify(data));	  				
}

