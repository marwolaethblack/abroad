import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
   country_from: String,
   country_in: String,
   title: String,
   author: {
         id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         },
         username: String
    },
   category: String,
   content: String,
   image: String,
   upvotes: Number,
   downvotes: Number,
   comments: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
    }]
});

export default mongoose.model("Post", postSchema);
