const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');


app.set('port', (process.env.PORT || 3001));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(bodyParser.json({type: '*/*'}));

// mongoose.Promise = global.Promise; only if the browser-console shows promise Warning
mongoose.connect("mongodb://abroad:dansko123@ds113650.mlab.com:13650/abroad", err => {
  if(err) console.log(err);
});

//Socket namespaces

//socket for real time comment loading
var postSocket = io.of('/post');
var connections = [];
postSocket.on('connection', function(socket) {
	connections.push(socket.id);
	console.log("comments " + connections.length);
	socket.on('roomPost', function(room) {
		socket.join(room);
		console.log(room + "comments");
	});	
	socket.on('disconnect', function(s) {
		connections.splice(connections.indexOf(s.id), 1);
		console.log("comments " + connections.length);
	});
});

//socket for real time notifications
var notificationSocket = io.of('/notif');
notificationSocket.on('connection', function(socket) {
	connections.push(socket.id);
	console.log("notif " + connections.length);

	socket.on('room', function(room) {
		socket.join(room);
		console.log(room + "notifs");
	});	
	socket.on('disconnect', function(s) {
		connections.splice(connections.indexOf(s.id), 1);
		console.log("notif " + connections.length);
	});
});




//Routes
var UserRoutes = require('./routes/user')(notificationSocket);
var PostRoutes = require('./routes/posts')(postSocket);
var CommentRoutes = require('./routes/comments')(postSocket, notificationSocket);
var AuthenticationRoutes = require('./routes/auth')(notificationSocket);

app.use(PostRoutes);
app.use(UserRoutes);
app.use(CommentRoutes);
app.use(AuthenticationRoutes);



http.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

