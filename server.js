var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
require('./config/passport')(passport);


var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(methodOverride());
app.use(session({secret: 'anyString',
									saveUninitialized: true,
									resave: true,
									store: new MongoStore({
										mongooseConnection: mongoose.connection, ttl: 2 * 24 * 60 * 60
									})
}));
app.use(passport.initialize());
app.use(passport.session()); //persistent login sesssion
app.use(flash()); // using connect-flash for flash messages stored in session

app.use(function(req, res, next){
	console.log(req.session);
	console.log("============");
	console.log(req.user);
	next();
});

app.set('view engine', 'ejs');

require('./app/routes.js')(app, passport);

app.listen(port, function(){
	console.log('Server running on ', port);
});