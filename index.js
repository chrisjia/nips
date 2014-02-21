/**
 * Module dependencies.
 */

var express = require('express'),
	auth = require('./bl/auth').auth,
	settings = require('./settings').settings,
    sys = require('sys');
  
var app = module.exports = express();
app.configure(function () {
	app.set('views', __dirname + '/views/jade');
	app.use(express.static(__dirname + '/views/res'));
  	app.use(express.favicon());
	app.use(express.cookieParser('post is cool'));
	app.use(express.cookieSession());
	app.use(auth.authorize());
})


require('./api/image')(app);
require('./api/busi')(app);
require('./views/print')(app);
if (!module.parent) {
  app.listen(3000);
  sys.log('Express started on port 3000');
}