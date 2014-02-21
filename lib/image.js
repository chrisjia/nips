var fs = require('fs'),
    sys = require('sys'),
    xmldoc = require('xmldoc'),
    gm = require('./gm.js'),
    async = require('async'),
    colors = require( "colors");

var Process = exports.Process = function(resource,parent,index){
	var self = this;
	self.id = "";
	self.index = index;
	self.subimgs = [];
	self.commands = [];
	self.resource = resource;
	
	this.out = function(){
		if(self.index === undefined){
			//last output
			return Date.now() + ".eps";
		}
		return  self.id + ".png";
	}

	this.parse = function(xml){
		var doc = new xmldoc.XmlDocument(xml);
		if(doc && doc.name == "image"){
			self.id = doc.attr.id;
			var i = 0;
			doc.childrenNamed("image").forEach(function(img){
				self.subimgs.push(new Process(self.resource, self,i++).parse(img))
			})
			var preCommand = null;
			doc.childrenNamed("command").forEach(function(command){
				var tmp = new gm.Command(self.resource,self,i++);
				preCommand = tmp.prev(preCommand);
				self.commands.push(tmp.parse(command));
			})
			return self.run;
		}else{
			throw new TypeError("bad image:" + xml)
		}
	}


	this.run = function(callback){
		var runCommand = function __command__(){
			var result = {};
			result[self.id] = self.out();
			if(self.commands.length > 0){
				async.series(self.commands,function(err,result){
					if(err == null){
						var r = {}
						for(var n in result[result.length-1]){
							r[self.id] = result[result.length-1][n];
							break;
						}
						callback(null,r)
					}else{
						callback(err,result)
					}})
			}else{
				callback(null,result)
			}
		}
		if(self.subimgs.length > 0){
			async.parallel(self.subimgs,function(err,results){
				if(err == null){
					results.forEach(function(r){
						for(var x in r){
							self.resource.add(x,r[x])
						}
					})
					runCommand()
				}else{
					callback(err)
				}
			})
		}else{
			runCommand()
		};
	}
}