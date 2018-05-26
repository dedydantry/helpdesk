let createError      = require('http-errors');
let express          = require('express');
let path             = require('path');
let cookieParser     = require('cookie-parser');
let logger           = require('morgan');
let fileUpload       = require('express-fileupload');
let session          = require('express-session');
let passport         = require('passport');
let LocalStrategy    = require('passport-local').Strategy;
let expressValidator = require('express-validator');
let moment 			 = require('moment');
let client = [];

// var router = express.Router();

// model
let User = require('./model/user');
// router
let indexRouter      = require('./routes/index');
let usersRouter      = require('./routes/users');
let authRouter       = require('./routes/auth');
let homeRouter       = require('./routes/home');
let alatRouter       = require('./routes/alat');
let ticketRouter     = require('./routes/ticket');
let commentRouter    = require('./routes/comment');
let reportRouter     = require('./routes/report');
let profilRouter    = require('./routes/profil');

let app = express();


// local variabel
app.locals.base_url = 'http://192.168.43.170:3000/';
app.locals.stringCustom = (string) => {
	var strings = string.toUpperCase()
    return strings.charAt(0);
};

app.locals.onlinecount = ()=>{
	return client.length-1;
}
app.locals.moment = (momentParams) =>{
	return moment(momentParams);
}
app.locals.online = (req, res)=>{

}
// view engine setup
app.io = require('socket.io')();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(function(req, res, next){
	res.io = app.io;
	next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

// express session
app.use(session({
	secret : 'secret',
	saveUninitialized : true,
	resave : true
}));

app.use(passport.initialize());
app.use(passport.session());
//load passport strategies
 
require('./config/passport.js')(passport,User);

app.use(expressValidator({
	errorFormatter:function(params, msg, value){
		var namespace = params.split('.')
		, riit = namespace.shift()
		,formParam = root;
		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param :formParam,
			msg : msg,
			value : value
		}
	}
}))

app.use('/', authRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
app.use('/alat', alatRouter);
app.use('/ticket', ticketRouter);
app.use('/comment', commentRouter);
app.use('/report', reportRouter);
app.use('/profil', profilRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if(req.user){
	  console.log('jumlah',client.length)
		res.io.emit('count-user', {'online' : client.length-1});
	  if(client.includes(req.user.email)){
			console.log('ada')
	  } else{
		  client.push(req.user.email);
		  res.io.emit('new-user', {'user':req.user.email, 'online' : client.length});
	  }
  }
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.io.on('connection', function(socket){
	console.log('user connection');
});

module.exports = app;
