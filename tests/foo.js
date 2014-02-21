var plugin = require("../lib/").plugin,
    	path = require('path');

var foo = new plugin.Plugin("../plugins/example","foo","./tmp",function(err,p){
						console.log(foo.args());
						if(err){
							console.log(err.toString());
						}else{
							foo.process({"content":"/users/jackie/projects/nips/tests/tmp/dog.jpg"},
										function(err,result){
											if(err)
												console.log(err.toString());
											else
												console.log("finished");
										})
						}
})
