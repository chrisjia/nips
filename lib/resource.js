var fs = require('fs'),
    sys = require('sys'),
    xmldoc = require('xmldoc'),
    colors = require( "colors");

var Resource = exports.Resource = function(plugin_home,wd){
	var self = this;
	self.last = "";
	self.plugin_home = plugin_home;
	self.dir = wd;

	this.wd = function(){
		return self.dir;
	}

	self.dict = {
	    "tmp":{},
		"input":{},
		"template":{}
	}

	this.getargs = function(){
		return self.dict["input"];
	}

	this.setargs = function(args){
		for(var name in args){
			if(self.dict["input"][name] != undefined){
				self.dict["input"][name] = args[name];
			}
		}
	}


	this.add = function(name,path){
		sys.log(("resource add:" + name + "=" + path).yellow);
		self.last = self.dict["tmp"][name] = self.wd() + "/" + path;
		return path;
	}

	this.parse = function(data,callback){
		var doc = new xmldoc.XmlDocument(data);
		if(doc && doc.name == "resource"){
			self.id = doc.attr.id;
			if(doc.childrenNamed("input")){
				doc.childrenNamed("input").forEach(function(item){
					self.dict["input"][item.attr.id] = item.attr.value;
				})
			}
			if(doc.childNamed("template")){
				doc.childNamed("template").childrenNamed("item").forEach(function(item){
					self.dict["template"][item.attr.id] = self.plugin_home + "/" + item.attr.value;
				})
			}
			if(callback != undefined) 
				callback(self);
			return self;
		}else{
			throw new TypeError("bad image:" + xml)
		}
	}


	this.get = function(name){
		for(var cate in self.dict){
			var result = self.dict[cate][name];
			if(result != undefined){
				return result;
			}
		}
		throw new TypeError("failed to get resource:" + type + "," + name);
	}

	this.cls = function(){
		for(var x in self.dict["tmp"]){
			var path = self.dict["tmp"][x];
			if(path !== self.last){
				fs.unlink(path,function(err){
					if(!err){
						
					}
				})
			}
		}
		for(var x in self.dict["input"]){
			var path = self.dict["input"][x];
			if(path !== self.last){
				fs.unlink(path,function(err){
					if(!err){
						
					}
				})
			}
		}
	}
}