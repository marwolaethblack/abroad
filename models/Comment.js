import mongoose from 'mongoose';

const commentSchema = new mongoose.schema({
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