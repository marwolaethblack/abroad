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



// import Sequelize from 'sequelize';
// import connection from './db';
// import User from './User';
// import Post from './PostNew'

// const Notification = connection.define('notification', {
//   id: { 
//     type: Sequelize.UUID, 
//     primaryKey: true, 
//     defaultValue: Sequelize.UUIDV4,
//     allowNull: false
//   },

//   text: { type: Sequelize.STRING, allowNull: false},

//   seen: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},

//   authorId: {
//    type: Sequelize.UUID,
//    references: {
//      model: User,
//      key: 'id'
//    }
//   },

//   postId: {
//    type: Sequelize.UUID,
//    references: {
//      model: Post,
//      key: 'id'
//    }
//   }
// });

// module.exports = Notification;
