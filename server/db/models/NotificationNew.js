// import DataTypes from 'sequelize';

// import connection from '../db';
// import UserGroup from './UserGroup';
// import User from './UserNew';
// import Post from './PostNew';
// import Reaction from './Reaction';
// import Comment from './CommentNew';
// import EntityType from './EntityType';


// const Notification = connection.define('notification', {
//   id: { 
//     type: DataTypes.UUID, 
//     primaryKey: true, 
//     defaultValue: DataTypes.UUIDV4,
//     allowNull: false
//   },

//   content: { type: DataTypes.STRING, allowNull: false },
// },
// {
//   timestamps: true,
//   updatedAt: false
// });

// // ?????
// Notification.belongsTo( Post, { foreignKey: 'entityId' });
// Notification.belongsTo( Comment, { foreignKey: 'entityId' });
// Notification.belongsTo( Reaction, { foreignKey: 'entityId' });

// Notification.belongsTo(EntityType);

// Notification.belongsTo(User, { foreignKey: 'authorId' });
// Notification.belongsTo(UserGroup, { foreignKey: 'ownerId' });


// module.exports = Notification;
// export default Notification;



module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
	  id: { 
	    type: DataTypes.UUID, 
	    primaryKey: true, 
	    defaultValue: DataTypes.UUIDV4,
	    allowNull: false
	  },

	  content: { type: DataTypes.STRING, allowNull: false },
  }, {
  	timestamps: true,
    updatedAt: false
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.Post, { foreignKey: 'entityId' });
	Notification.belongsTo(models.Comment, { foreignKey: 'entityId' });
	Notification.belongsTo(models.Reaction, { foreignKey: 'entityId' });

	Notification.belongsTo(models.EntityType);

	Notification.belongsTo(models.User, { foreignKey: 'authorId', onDelete: 'cascade' });
	Notification.belongsTo(models.UserGroup, { foreignKey: 'ownerId' });
  }

  return Notification;
};