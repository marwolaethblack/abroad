var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var morgan = require('morgan');
var passport = require('passport');



app.set('port', (process.env.PORT || 3001));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}


app.use(passport.initialize());
app.use(express.static(__dirname + '/public'));
app.use(express.static('./uploads'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// mongoose.Promise = global.Promise; only if the browser-console shows promise Warning
mongoose.connect("mongodb://abroad:dansko123@ds113650.mlab.com:13650/abroad", function(err) {
  if(err) console.log(err);
});

//Socket namespaces

//socket for real time comment loading
var postSocket = io.of('/post');
var connections = [];
postSocket.on('connection', function(socket) {
	connections.push(socket.id);
	// console.log("comments " + connections.length);
	socket.on('roomPost', function(room) {
		socket.join(room);
		// console.log(room + "comments");
	});	
	socket.on('disconnect', function(s) {
		connections.splice(connections.indexOf(s.id), 1);
		// console.log("comments " + connections.length);
	});
});

//socket for real time notifications
var notificationSocket = io.of('/notif');
notificationSocket.on('connection', function(socket) {
	connections.push(socket.id);
	// console.log("notif " + connections.length);

	socket.on('room', function(room) {
		socket.join(room);
		// console.log(room + "notifs");
	});	
	socket.on('disconnect', function(s) {
		connections.splice(connections.indexOf(s.id), 1);
		// console.log("notif " + connections.length);
	});
});




//Routes
var UserRoutes = require('./routes/user')(notificationSocket);
var PostRoutes = require('./routes/posts')(postSocket);
var CommentRoutes = require('./routes/comments')(postSocket, notificationSocket);
var AuthenticationRoutes = require('./routes/auth')(notificationSocket);
var NotificationRoutes = require('./routes/notifications')(notificationSocket);

app.use(PostRoutes);
app.use(UserRoutes);
app.use(CommentRoutes);
app.use(AuthenticationRoutes);
app.use(NotificationRoutes);



http.listen(app.get('port'), function() {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

