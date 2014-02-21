var formidable = require('formidable'),
    settings = require('../settings').settings,
    plugin = require("../lib/").plugin,
    out = require('../out'),
    colors = require('colors'),
    fs = require('fs'),
    sys = require('sys');

var image = {
    get:{
      methods: function(req, res){
          var plugins = fs.readdirSync(settings.plugin_home);
          var results = [];
          plugins.forEach(function(item){
               var path = settings.plugin_home + '/' + item;
               if(fs.statSync(path).isDirectory()){
                    var files = fs.readdirSync(path);
                    var name = "";
                    files.forEach(function(tmp){
                        if(tmp.match(/(.*)\.xml?/)){
                             name = tmp.replace(".xml","")
                             var foo = new plugin.Plugin(path,name,settings.tmp);
                             results.push({name:foo.name,args:foo.args(),path: "/"+item+"/"+name});
                        }
                    })
                };
          })
          out.json(res,200,results); 
    }},

    post:{
      composite: function(req, res){
        var form = new formidable.IncomingForm();
        var wd = form.uploadDir = settings.user_wd(req);
        form.keepExtensions = true;
        form.on('progress', function(bytesReceived, bytesExpected) {
           
        });
        form.on('end', function(){
            
        });
        form.parse(req,function(err, fields, files) {
            var input = {};
            for(var name in files){
                input[name] = files[name]["path"];
            }
            var tmp = fields["plugin_name"].split("/");
            var plugin_home = settings.plugin_home;
            while(tmp.length > 1) 
                plugin_home += "/" + tmp.shift();
            var foo = new plugin.Plugin(plugin_home,tmp[0],wd,function(err,plin){
                   if(!err){
                        plin.process(input,function(err,result){
                                            if(err){
                                                sys.log(err.toString('utf-8').red);
                                                out.err(res, 404,"err");
                                            }else{
                                                for(var name in result){
                                                    var realPath = wd + "/" + result[name];
                                                    out.image(res,"image/png",realPath);
                                                    break;
                                                }
                                            }
                                        }) 
                  }else{
                       out.err(res,504,""); 
                  }
            });
           
        });
    }}
}

/// hook
module.exports = function(app){
  for(var method in image){
     for(var func in image[method]){
        app[method]("/image/" + func, image[method][func]);
     }
  }
}

