import Sequelize from 'sequelize';
import connection from './db';
import User from './UserNew';
import Comment from './Comment';
// import CommentModel from './Comment';
// import UserModel from './User';
import paginate from 'mongoose-paginate'; // ???


const Post = connection.define('post', {
  id: { 
    type: Sequelize.UUID, 
    primaryKey: true, 
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },

  countryFrom: { type: Sequelize.STRING, allowNull: false},

  countryIn: { type: Sequelize.STRING, allowNull: false},

  title: { type: Sequelize.STRING, allowNull: false},

  category: { type: Sequelize.STRING, allowNull: false},

  content: { type: Sequelize.TEXT, allowNull: false},

  image: Sequelize.STRING,

  isAnswered: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},

  upvotes: { type: Sequelize.INTEGER, defaultValue: 0 },

  authorId: {
   type: Sequelize.UUID,
   references: {
     model: User,
     key: 'id'
   }
 }
},
  {
    timestamps: true,
    updatedAt: false,
  }
);

// Post.hasMany(Comment);

// connection.sync().then(()=> console.log("SUCCESS")).catch(err=>console.log("FUCK sync: "+err))  
module.exports = Post;




//add the paginate function to postSchema
// postSchema.plugin(paginate);


