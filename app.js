
/**
 * Module dependencies.
 */

var express = require('express');
//lembrar de iniciar o redis-server para que as sessions funcionem
var RedisStore = require('connect-redis')(express);
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');

var app = express(),
    mailer = require('express-mailer');

mailer.extend(app, {
  from: 'blog@baufaker.com',
  host: 'smtp.gmail.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'baufaker@gmail.com',
    pass: 'vamosemboraparabogota'
  }
});

//habilitando sessions
app.use(express.cookieParser());
app.use(express.session({
	secret: '1234567890QWERTY',
	store: new RedisStore
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var mongoose = require('mongoose');

//inicia uma requisição de conexão do servidor
mongoose.connect('mongodb://localhost/Blog_Gui');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.locals.pretty = true;
}

//definição dinâmica de rotas
fs.readdirSync('./controllers').forEach(function(file){ 
	if(file.substr(-3) == ".js"){
		route = require('./controllers/'+file);
		route.controller(app);
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
