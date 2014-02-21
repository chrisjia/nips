var record = require("../bl/").record,
	moment = require('moment'),
	bill = require("../bl/").bill;

/// hook
var scripts = [
	"http://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"
];

module.exports = function(app){
    app.get("/queue",function(req,resp){
    	record.status("",1,100,function(err,results){
    		resp.render("index.jade",{jobs:results,scripts:scripts,moment:moment})
    	})
    })
}