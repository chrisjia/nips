var formidable = require('formidable'),
    settings = require('../settings').settings,
    plugin = require("../lib/").plugin,
    record = require("../bl/").record,
    bill = require("../bl/").bill,
    out = require('../out'),
    colors = require('colors'),
    fs = require('fs'),
    sys = require('sys'),
    qrcode = require("../lib/qrcode");

var __parse_form_ = function(req,resp,func){
    var form = new formidable.IncomingForm();
    form.uploadDir = __workspace_(req);
    form.keepExtensions = true;
    form.on('progress', function(bytesReceived, bytesExpected) {
        //nothing todo
    });
    form.on('end', function(){
        //nothing todo
    });
    form.parse(req,function(err,fileds,files){
        if(err){
           out.json(resp,500,{err:err});
           return;
        }else{
           func(fileds,files);
        }
    });
}

var __gen_qrcode_ = function(text, path, callback){
    var qr = qrcode.qrcode(4, 'M');
    qr.addData(text);
    qr.make();
    var data = new Buffer(qr.createImgData(4));
    fs.open(path, 'w', function(err, fd) {
        if (err) {
            callback(err,null);
        } else {
            fs.write(fd, data, 0, data.length, null, function(err) {
                if(err) callback(err,null);
                fs.close(fd, function() {
                  callback(null,path);
                })
            });
        }
    });
}

var __uid_ = function(r){
  return r["uid"] || "others";
}

var __workspace_ = function(r){
  var uid = __uid_(r);
  var dir =  __dirname + "/../photos/" + uid;
  if(!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
  return dir;
}

/** 发送逻辑 **/
var sender = {
    post:{
      /* sent card to someone */
      send: function(req,resp) { 
          __parse_form_(req,resp,function(fields, files) {
              var fn = files["content"]["path"].split("/").pop();
              /* inputs */
              var rcd = {
                  uid:__uid_(req),
                  recver: {
                      mobile:"",
                      addr:""
                  },
                  image:{
                      src: "/" + fn,
                      geo:"",
                      time:Date.now(),
                      process:fields["process"],
                      out:"",
                  },
                  status:0
              };
              record.create(rcd,function(err, docs){
                  out.json(resp,200,{err:err});
                  if(err == null){
                      sys.log(("record created:" + docs[0]["_id"]).green);
                  }else{
                      sys.log(("record create failed with err:" + err).red);
                  }
              });
          })
      },

      /** bills **/
      bills: function(req,resp){
          __parse_form_(req,resp,function(fields, files) {
              var uid = fields["uid"];
              if(!/\w+/.test(uid)){
                    out.json(resp,200,{err:"param err"})
              }else{
                bill.get(uid,0,function(err,bills){
                    out.json(resp,200,{err:err,results:bills})
                })
              }
          })
      }
    }
}

/** 接收逻辑 **/
var recver = {
    post: {
      /* accept to receiv the card */
      accept: function(req,resp) {
         __parse_form_(req,resp,function(fields, files) {
            var rid = fields["rid"];
            if(!/\d+/.test(rid)){
                out.json(resp,200,{err:"param error"}); 
            }else{
              record.update(rid,{
                                 "recver.addr":fields["addr"],
                                 "status":1
                                },
                            function(err,result){
                                if(err == null && result != null){
                                    var image = result["image"];
                                    var wd = __workspace_(result);
                                    __gen_qrcode_(result["_id"],wd+"/"+rid+".gif",function(err,path){
                                          if(!err){
                                            var input = {"content":wd+image["src"],"qr":path}; //TODO
                                            var pluginname = image["process"];
                                            var tmp = pluginname.split("/");
                                            var plugin_home = settings.plugin_home;
                                            
                                            while(tmp.length > 1) 
                                                plugin_home += "/" + tmp.shift();
                                            var foo = new plugin.Plugin(plugin_home,tmp[0],wd,function(err,plin){
                                                   if(!err){
                                                        plin.process(input,function(err,result){
                                                                            if(err){
                                                                                sys.log(err.toString('utf-8').red);
                                                                                out.json(resp,200,{err:err});
                                                                            }else{
                                                                                record.update(rid,{"image.out":"/"+result["out"]},function(err,r){
                                                                                    out.json(resp,200,{err:err});
                                                                                })
                                                                            }
                                                                        }) 
                                                  }else{
                                                       out.err(resp,504,""); 
                                                  }
                                            })
                                        }else{
                                             out.json(resp,200,{err:err});
                                        }
                                    });
                                }else{
                                    out.json(resp,200,{err:err});
                                    sys.log(("record accepted failed with err:" + err).red);
                                }
                            }
            )}
         }) 
      }
    }
}

/** 服务逻辑 **/
var poster = {
    post: {
      /* 获取任务列表 */
      get: function(req, resp){
          __parse_form_(req,resp,function(fields, files) {
              var n = 1;
              if(fields["n"] != undefined){
                  n = parseInt(fields["n"]);
              }
              record.status(fields["id"]||"",fields["status"],n, function(err,results){
                  sys.log("jobs returned".green);
                  out.json(resp,200,{err:err,results:results});
              })
          })
      },

      dl:function(req,resp){
         __parse_form_(req,resp,function(fields, files) {
              var rid = fields["rid"];
              if(!/\d+/.test(rid)){
                  out.err(resp,404,"not found"); 
              }else{
                  record.update(rid,{"status":2},function(err,result){
                      if(err || result == null){
                          out.err(resp,404,"not found"); 
                      }else{
                          var wd = __workspace_(result); //TODO
                          out.image(resp,"image/png",wd+result["image"]["out"]);
                      }
                  })
              }
          })
      },

      print_sta: function(req, resp){
          __parse_form_(req,resp,function(fields, files) {
              var rid = fields["rid"];
              var sta = fields["sta"];
              if(!/\w+/.test(rid)){
                  out.json(resp,200,{err:"param error"}); 
              }else{
                var error = fields["err"] || "";
                record.update(rid,{"status":3,"error":error},
                            function(err,r){
                                 if(err == null){
                                      if(r !== undefined && r !== null){
                                        /** add bill **/
                                        bill.add(r["uid"],rid, 4.00 ,function(err1,docs){
                                            sys.log(("bills added:" + r["uid"]).green);
                                            out.json(resp,200,{err:err});
                                        })
                                      }else{
                                          out.json(resp,200,{err:"not found"});
                                      }
                                 }else{
                                      out.json(resp,200,{err:err});
                                 }
                                 sys.log(("jobs printed with err:" + err).green);
                            })
              }
          })
      },

      delived: function(req, resp){
           __parse_form_(req,resp,function(fields, files) {
              var rid = fields["rid"];
              if(!/\w+/.test(rid)){
                  out.json(resp,200,{err:"param error"}); 
              }else{
                  record.update(rid,{"status":4},
                          function(err,r){
                                if(err == null){
                                      if(r !== undefined && r !== null){
                                          //TODO
                                      }else{
                                          out.json(resp,200,{err:"not found"});
                                      }
                                 }
                                 out.json(resp,200,{err:err});
                                 sys.log(("jobs delivered:" + fields["rid"]).green);
                          })
              }
          })
      }
    }
}



/// hook
module.exports = function(app){
  for(var method in sender){
     for(var func in sender[method]){
        app[method]("/api/" + func, sender[method][func]);
     }
  }
  for(var method in recver){
     for(var func in recver[method]){
        app[method]("/api/" + func, recver[method][func]);
     }
  }
  for(var method in poster){
     for(var func in poster[method]){
        app[method]("/api/jobs/" + func, poster[method][func]);
     }
  }
}

