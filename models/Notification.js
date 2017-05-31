import mongoose from 'mongoose';
import paginate from 'mongoose-paginate';

const notificationSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  postId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Post"
    },
  text: String,
  author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
  },
  seen: { type: Boolean, default: false, required: true }
  
});

//add the paginate function to notificationSchema
notificationSchema.plugin(paginate);

module.exports = mongoose.model("Notification", notificationSchema);