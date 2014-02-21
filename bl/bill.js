var sys = require('sys'),
	  colors = require( "colors"),
    mongocli = require('mongodb').MongoClient,
    format = require('util').format,
    objectid = require('mongodb').ObjectID,
    settings = require('../settings').settings;
   
var BILL_NAME = "bill"; 

var bill = exports.bill = {

  get: function(uid,status,callback){
       mongocli.connect(settings.database,function(err,db){
            var records = db.collection(BILL_NAME);
             records.find({status:status}).toArray(callback);
       })
  },

	add: function(uid,rid,num,callback){
        mongocli.connect(settings.database,function(err,db){
            var records = db.collection(BILL_NAME);
            records.insert({
                              uid:uid,
                              num:num,
                              rid:rid,
                              time:Date.now(),
                              status:0
                           },callback);
        })
	},

  pay: function(uid,rids,num,callback){
        mongocli.connect(settings.database,function(err,db){
            var records = db.collection(BILL_NAME);
            records.update({uid:uid}, {"$set":{status:1}} ,{w:1}, callback);
        }) 
  }
}