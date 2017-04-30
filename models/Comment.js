import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
  },
  level: Number,
  content: String,
  upvotes: Number,
  comments: { type : Array , "default" : [] },
  
});

commentSchema.index({upvotes: -1});

export default mongoose.model("Comment", commentSchema);