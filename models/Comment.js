import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
  },
  content: String,
  upvotes: Number,
  comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
  
});

export default mongoose.model("Comment", commentSchema);