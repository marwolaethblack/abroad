import Sequelize from 'sequelize';
import connection from './db';
import User from './UserNew';
import Post from './PostNew'

const Notification = connection.define('notification', {
  id: { 
    type: Sequelize.UUID, 
    primaryKey: true, 
    defaultValue: Sequelize.UUIDV4,
    allowNull: false
  },

  type: { type: Sequelize.ENUM('post', 'comment','subscription','administration'), allowNull: false },

  text: { type: Sequelize.STRING, allowNull: false },

  seen: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },

  authorId: {
   type: Sequelize.UUID,
   references: {
     model: User,
     key: 'id'
   }
  },

  ownerId: {
   type: Sequelize.UUID,
   references: {
     model: User,
     key: 'id'
   }
  },

  entityId: {
   type: Sequelize.UUID,
   references: {
     model: Post,
     key: 'id'
   }
  }
},
{
  timestamps: true,
  updatedAt: false,
});

module.exports = Notification;