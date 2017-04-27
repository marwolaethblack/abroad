var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';


app.set('port', (process.env.PORT || 3001));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(express.static(__dirname + '/public'));
//app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({type: '*/*'}));

// mongoose.Promise = global.Promise; only if the browser-console shows promise Warning
mongoose.connect("mongodb://abroad:dansko123@ds113650.mlab.com:13650/abroad", err => {
  if(err) console.log(err);
});

//Socket namespaces
var postSocket = io.of('/post');
var connections = [];
postSocket.on('connection', function(socket) {
	connections.push(socket.id);
	console.log(connections.length);
})



//Routes
var UserRoutes = require('./routes/user')(io);
var PostRoutes = require('./routes/posts')(postSocket);
var CommentRoutes = require('./routes/comments')(postSocket);
var AuthenticationRoutes = require('./routes/auth')(io);

app.use(PostRoutes);
app.use(UserRoutes);
app.use(CommentRoutes);
app.use(AuthenticationRoutes);



http.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

