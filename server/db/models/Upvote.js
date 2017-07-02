// import DataTypes from 'sequelize';

// import connection from '../db';
// import User from './UserNew';
// import Post from './PostNew';
// import Comment from './CommentNew';
// import Reaction from './Reaction';
// import EntityType from './EntityType';


// const Upvote = connection.define('upvote', {
//   id: { 
//     type: DataTypes.UUID, 
//     primaryKey: true, 
//     defaultValue: DataTypes.UUIDV4,
//     allowNull: false
//   }
// },
// {
//   timestamps: true,
//   updatedAt: false
// });


// Upvote.belongsTo(User);
// Upvote.belongsTo(EntityType);

// // Upvote.belongsTo(Post, { foreignKey: 'entityId' });
// // Upvote.belongsTo(Comment, { foreignKey: 'entityId' });
// // Upvote.belongsTo(Reaction, { foreignKey: 'entityId' });

// export default Upvote;
// module.exports = Upvote;


module.exports = (sequelize, DataTypes) => {
  const Upvote = sequelize.define('Upvote', {
	  id: { 
	    type: DataTypes.UUID, 
	    primaryKey: true, 
	    defaultValue: DataTypes.UUIDV4,
	    allowNull: false
	  }
  }, {
	timestamps: true,
	updatedAt: false
  });

  Upvote.associate = (models) => {
    Upvote.belongsTo(models.User);
	Upvote.belongsTo(models.EntityType);
	// ???????????????????????????????????????????????????
	Upvote.belongsTo(models.Post, { foreignKey: 'entityId' });
	Upvote.belongsTo(models.Comment, { foreignKey: 'entityId' });
	Upvote.belongsTo(models.Reaction, { foreignKey: 'entityId' });
  }

  return Upvote;
};