import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import PostModel from './models/Post';


const app = express();
app.set('port', (process.env.PORT || 3001));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// mongoose.Promise = global.Promise; only if the browser-console shows promise Warning
mongoose.connect("mongodb://abroad:dansko123@ds113650.mlab.com:13650/abroad", err => {
  if(err) console.log(err);
});


app.get('/api/posts',(req,res) => {
	PostModel.find(req.query,(err,posts) => {
		if(err) console.log(err);
		res.json(posts);
	});
});

app.get('/api/post',(req,res) => {
	PostModel.findById(req.query.id).lean.exec((err,singlePOst) => {
		if(err) console.log(err);
		res.json(singlePost);
	});
});





// app.get('/api/todos/:id',(req,res) => {
//  const todoId = mongoose.Types.ObjectId(req.params.id);
//  TodoModel.findOne({_id:todoId},(err,todo) => {
//    if(err) console.log(err);
//    res.json(todo);
//  });
// });



// app.put('/api/todos/:id',(req,res) => {

//  const todoId = mongoose.Types.ObjectId(req.body._id);

//  TodoModel.findOneAndUpdate({_id:todoId}, req.body,(err, doc) => {
//     if (err) return res.status(500).send({ error: err });
//     return res.send(doc);
//  });
// });

// app.delete('/api/todos/:id',(req,res) => {
//  const todoId = mongoose.Types.ObjectId(req.params.id);
//  TodoModel.remove({_id:todoId},err => {
//    if (err) return res.status(500).send({ error: err });
//    return res.status(200).send();
//  });
// });

// app.post('/api/todos/', (req, res) => {
//   const newTodo = new TodoModel(req.body);
//   newTodo.save(err => {
//  if(err) console.log(err);
//   });
//   res.json(newTodo);
//  });

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

