var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var reload = require('reload');
var mongoose = require("mongoose");
var mongo = require("mongodb");
var swig = require("swig");
var bodyParser = require('body-parser');

var my_conf = require('./config.json');

var app = express();

//set up the sockets
app.set('port', process.env.PORT || 3000);
var server = http.createServer(app);
var io = require('socket.io').listen(server, { log: false });
server.listen(app.get('port'));

//set up the swig
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

/* ROUTES */
var index = require('./routes/index');

var db_connection = 'mongodb://localhost/openresume'

var args = require("minimist")(process.argv.slice(2))
//include winston
//include underscore

//all environments
app.set('port', process.env.PORT || my_conf.server_options.port);
app.configure(function() {
	app.use(express.favicon(__dirname + '/public/favicon.ico'));
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.cookieParser(my_conf.server_options.cookie_parser_secret));
	app.use(express.session());
	app.use(app.router);
})

app.configure('test', function() {
	//connect to different db during tests
	//remove all existing data in the document so there's no conflicts.

	//WHY MUST YOU MAKE ME DO THIS MONGO!!!!!!!!!!!!!!!
	var count = 0;
	console.log('TESTING')
	
	function clearDB(total, fn) {
		for (i in mongoose.connection.collections) {
			removeDoc(i, total, fn)
		}
	}

	function removeDoc(i, total, fn) {
		mongoose.connection.collections[i].remove({}, function() {
			count++;
			console.log('removed all entries for ' + i + ' in db.')
			if (count === total) {
				fn()
			}
		}) //mongoose drop
	}

	mongoose.connect('mongodb://localhost/openresume-testing', function(err) {
		var total_dbs = Object.keys(mongoose.connection.collections).length;
		clearDB(total_dbs, function() {
			console.log('cleared all dbs!')
		});
	});
})

app.configure('development', function() {
	console.log('DEVELOPMENT')

	if (process.env.MONGOHQ_URL) {
		//if theres an mongohq_url variable set, use that as the url for the db. 
		console.log("database URL set : " + process.env.db_connection)
		db_connection = process.env.MONGOHQ_URL
	}

	mongoose.connect(db_connection, function(err) {
		if (!err) { console.log("connected to mongodb") } else { throw err; }
	});
});

app.configure('production', function() {
	console.log("PRODUCTION");
});

/* HOME */
app.get('/', index.index);
app.get('/upload', index.upload_get);
app.post('/upload', index.upload_post);
app.put('/upload', index.upload_put);
app.get('/list', index.list);
app.get('/clear', index.clear);
app.get('/browse', index.browse);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
}); 
