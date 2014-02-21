var sys = require('sys'),
	  colors = require( "colors"),
    mongocli = require('mongodb').MongoClient,
    util = require('util').util,
    objectid = require('mongodb').ObjectID,
    out = require('../out'),
    settings = require('../settings').settings;
   
var USR_NAME = "user"; 

var auth = exports.auth = {

  gen: function(uid,callback){
       mongocli.connect(settings.database,function(err,db){
            if(err){
                callback(err,null);
            }else{
              var records = db.collection(USR_NAME);
              records.insert({uid:uid,code:util.random(6),time:Date.now()},callback);
            }
       })
  },

  authorize: function(){
      return function(req,resp,next){
          var uid = req.headers["x-auth-user"] || "";
          var code = req.headers["x-auth-code"] || "";
          mongocli.connect(settings.database,function(err,db){
            if(!err){
              var records = db.collection(USR_NAME);
              records.find({uid:uid,code:code}).toArray(function(err,docs){
                  if(err == null && docs.length > 0){
                      next();
                  }else{
                      //out.json(resp,200,{err:"auth failed"});
                  }
              });
            }
            next();
       })}
  }
}