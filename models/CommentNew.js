import Sequelize from 'sequelize';
import connection from './db';
import User from './UserNew';
import Post from './PostNew'


const Comment = connection.define('comment', {
  id: { 
    type: Sequelize.UUID, 
    primaryKey: true, 
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },

  content: { type: Sequelize.TEXT, allowNull: false},

  isAnswer: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},

  parents: { type: Sequelize.ARRAY(Sequelize.UUID), defaultValue: [] },

  upvotes: { type: Sequelize.INTEGER, defaultValue: 0 },

  authorId: {
   type: Sequelize.UUID,
   references: {
     model: User,
     key: 'id'
   }
  },

  postId: {
   type: Sequelize.UUID,
   references: {
     model: Post,
     key: 'id'
   }
  }
});

Comment.hasMany(Comment);

module.exports = Comment;