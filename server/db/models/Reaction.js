// import DataTypes from 'sequelize';
// var logger = require('tracer').colorConsole({level:'info'});

// import connection from '../db';
// import User from './UserNew';
// import Post from './PostNew';
// import Comment from './CommentNew';
// import Upvote from './Upvote';


// const Reaction = connection.define('reaction', {
//   id: { 
//     type: DataTypes.UUID, 
//     primaryKey: true, 
//     defaultValue: DataTypes.UUIDV4,
//     allowNull: false
//   },

//   content: { type: DataTypes.TEXT, allowNull: false },

//   isAnswer: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }

// });

// Reaction.belongsTo(User, { foreignKey: "authorId" });
// // Reaction.belongsTo(Post);

// // connection.sync();

// logger.info(Reaction);

// // module.exports = Reaction;
// export default Reaction;

module.exports = (sequelize, DataTypes) => {
  const Reaction = sequelize.define('Reaction', {
	  id: { 
	    type: DataTypes.UUID, 
	    primaryKey: true, 
	    defaultValue: DataTypes.UUIDV4,
	    allowNull: false
	  },

	  content: { type: DataTypes.TEXT, allowNull: false },

	  isAnswer: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  });

  Reaction.associate = (models) => {
    Reaction.belongsTo(models.User, { foreignKey: "authorId" });
  }

  return Reaction;
};