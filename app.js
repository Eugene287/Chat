var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');

var routes = require('./routes');
var users = require('./routes/user');
var checkAuth = require('./utils/checkAuth');
var reg = require('./routes/reg');
var auth = require('./routes/auth');

var chat = require('./routes/chat');
var video = require('./routes/video');


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//insert data
var Maintexts = require('./models/maintexts').maintexts;
var maintexts = new Maintexts({
name:'Ку-ку',
body:'Текст для главной страницы',
url:'index'
});
maintexts.save(function(err,user){console.log('OK!!!')});
//end

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use (express.bodyParser({keepExtensions:true, uploadDir:'public/tmp'}));
app.use(express.session({secret :'asd', key:'sid'}));
app.use(function(req,res,next){
	res.locals = {
		userid : req.session.user};
		next();
})
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);



app.get('/', routes.index);
app.get('/users', users.list);
app.get('/reg', reg.index);
app.get('/cabinet', checkAuth, auth.cabinet);
app.get('/logout', checkAuth, reg.logout);
app.get('/chat', chat.index);
app.get('/video', video.index);
app.get('/:id', routes.index);//всегда последний




//post data
app.post('/reg', reg.send);
app.post('/cabinet', checkAuth, auth.send);


io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.listen(config.get('port'));
module.exports = app;
