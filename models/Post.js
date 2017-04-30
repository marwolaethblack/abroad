import mongoose from 'mongoose';
import CommentModel from './Comment';

const postSchema = new mongoose.Schema({
   country_from: String,
   country_in: String,
   city: String,
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
   upvotes: { type: Number, default: 0 },
   comments: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment",
         default: []
    }]
});

postSchema.index({upvotes: -1});

postSchema.post('findOneAndRemove', (deletedPost) => {
   //delete all comments of the deleted post
   if(deletedPost && deletedPost.comments !== undefined && deletedPost.comments.length){
      CommentModel.remove({ _id:{ $in: deletedPost.comments }}, (err) => {
         if(err) console.log(err);
      });
   }  
});

export default mongoose.model("Post", postSchema);
