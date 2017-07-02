// import DataTypes from 'sequelize';
// var logger = require('tracer').colorConsole({level:'info'});

// import connection from '../db';
// import User from './UserNew';
// import Reaction from './Reaction';


module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
	  id: { 
	    type: DataTypes.UUID, 
	    primaryKey: true, 
	    defaultValue: DataTypes.UUIDV4,
	    allowNull: false
	  },

	  content: { type: DataTypes.TEXT, allowNull: false }
  });

  Comment.associate = (models) => {
    Comment.hasMany(models.Comment, { onDelete: 'cascade' });
	Comment.belongsTo(models.Reaction, { onDelete: 'cascade' });
	Comment.belongsTo(models.User, { foreignKey: "authorId", onDelete: 'cascade' });
  }

  return Comment;
};


// logger.info(JSON.stringify(Reaction));

// const Comment = connection.define('comment', {
  // id: { 
  //   type: DataTypes.UUID, 
  //   primaryKey: true, 
  //   defaultValue: DataTypes.UUIDV4,
  //   allowNull: false
  // },

  // content: { type: DataTypes.TEXT, allowNull: false }
// });

// Comment.hasMany(Comment);
// // Comment.belongsTo(Reaction);
// Comment.belongsTo(User, { foreignKey: "authorId" });

// export default Comment;
// module.exports = Comment;