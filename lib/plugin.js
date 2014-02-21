var fs = require('fs'),
    sys = require('sys'),
    xmldoc = require('xmldoc'),
    image = require('./image'), 
    resource = require('./resource');

var Plugin = exports.Plugin = function(home,name,wd,onload){
	var self = this;
	self.name = name;
	var path = home + "/" + name + ".xml";
	error = null;
	try{
		var data = fs.readFileSync(path, 'utf8');
		self.doc = new xmldoc.XmlDocument(data);
		self.resource = new resource.Resource(home,wd).parse(self.doc.childNamed('resource'));
		self.proc = new image.Process(self.resource).parse(self.doc.childNamed('image'));
	}catch(err){
		error = err;
		sys.log(err.toString('utf-8').red);
	}
 	/////////
	this.args = function(){
		return self.resource.getargs();
	};

	this.process = function(args,callback){
		self.resource.setargs(args);
		self.proc(function(err,result){
			callback(err,result);
			if(!err){
				self.resource.cls()
			}
		});
	}

	if(onload) onload(error,self);
}

