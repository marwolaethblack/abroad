import mongoose from 'mongoose';

var commentSchema = new mongoose.Schema({
  author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
  },
  postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
  parents: { type : Array , "default" : [] },
  content: String,
  upvotes: Number,
  comments: { type : Array , "default" : [] },
  
});

commentSchema.index({upvotes: -1});

module.exports = mongoose.model("Comment", commentSchema);