var xmldoc = require('xmldoc'),
	spawn = require('child_process').spawn,
	sys = require('sys');
	colors = require( "colors");

var Command = exports.Command = function(resource,parent,index){
	var self = this;
	self.parent = parent;
	self.id = "";
	self.exec = "";
	self.args = [];
	self.resource = resource;
	self.index = index;
	self._prev = null;
	self._next = null;

	this.out = function(){
		var parent_out = self.parent.out();
		if(!self._next){
			return parent_out;
		}else{
			return parent_out.split(".")[0] + "_" + self.index + ".png";
		}
	}

	this.prev = function(command){
		self._prev = command;
		if(command) command.next(self);
		return self;
	}

	this.next = function(command){
		self._next = command;
	}

	this.parse = function(xml){
		var doc = new xmldoc.XmlDocument(xml);
		if(doc && doc.name == "command"){
			self.id = doc.attr.id;
			self.exec = doc.attr.exec;
			self.args = doc.attr.args.split(" ");
			return self.call;
		}else{
			throw new TypeError("bad command:" + xml)
		}
	}

	this.call = function(callback){
		var args = [];
		var output = self.out();
		self.args = self.args.concat(self.resource.wd() + "/" + output);
		self.args.forEach(function(param){
			if((matches = param.match(/%(\w+)/)) != null ){
				v = matches[1];
				if(self.resource){
					param = param.replace("%"+v,self.resource.get(v));
				}else{
					throw new TypeError("%" + v + " is not set");
				}
			}
			args.push(param);
		});
		sys.log((self.exec + " " + args.join(" ")).green);
		var proc = spawn(self.exec, args);
		proc.stdout.on("data",function(data){
			sys.log("stdout:" + data.toString());
		});
		proc.stderr.on("data",function(data){
			callback(data.toString(),self.name);
		});
		proc.on("error",function(e){
			sys.log(e.toString().red);
		});
		proc.on("exit",function(code,signal){
			if(code == 0){
				var result = {};
				result[self.id] = self.resource.add(self.id,output);
				sys.log("output [" + self.id + "]: " + output.blue);
				callback(null,result);
			}else{
				callback(code,null);
			}
		})
		
	}
} 
