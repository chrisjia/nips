var sys = require('sys'),
	  colors = require( "colors"),
    mongocli = require('mongodb').MongoClient,
    format = require('util').format,
    objectid = require('mongodb').ObjectID,
    settings = require('../settings').settings;
   
var RECORD_NAME = "record"; 

var record = exports.record = {
	create: function(attr,callback){
        mongocli.connect(settings.database,function(err,db){
            if(err){
                callback(err,null);
            }else{
                var records = db.collection(RECORD_NAME);
                attr.modified = Date.now();
                records.insert(attr,callback);
            }
        })
	},

  status: function(id,status,n,callback){
       mongocli.connect(settings.database,function(err,db){
            if(err){
                callback(err,null);
            }else{
              var records = db.collection(RECORD_NAME);
              var q = {"status":parseInt(status)};
              if(id != ""){
                  try{
                    q["_id"] = new objectid(id);
                  }catch(e){
                      callback(err,null);
                  }
              }
              records.find(q).limit(n).toArray(callback);
            }
        })
  },

	get: function(id,callback){
        mongocli.connect(settings.database,function(err,db){
            if(err){
                callback(err,null);
            }else{
              var records = db.collection(RECORD_NAME);
              try{
                  records.find({"_id":new objectid(id)}).toArray(callback);
              }catch(e){
                callback(err,null);
              }
            }
        })
	},

	update: function(id,attr,callback){
         mongocli.connect(settings.database,function(err,db){
            if(err){
                callback(err,null);
            }else{
              var records = db.collection(RECORD_NAME);
              attr.modified = Date.now();
              try{
                    records.findAndModify({"_id":new objectid(id)},[['_id','asc']],{"$set":attr},{ },callback);
              }catch(e){
                  callback(err,null);
              }
            }
         })
	},

	remove: function(id,callback){
         mongocli.connect(settings.database,function(err,db){
              if(err){
                callback(err,null);
              }else{
                var records = db.collection(RECORD_NAME);
                try{
                    records.remove({"_id":new objectid(id)},callback);
                }catch(e){
                    callback(err,null);
                }
              }
         })
	}
}