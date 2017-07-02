// import DataTypes from 'sequelize';

// import connection from '../db';
// import Post from './PostNew';


// const PostSubscriptionGroup = connection.define('postSubscriptionGroup', {
//   id: { 
//     type: DataTypes.UUID, 
//     primaryKey: true, 
//     defaultValue: DataTypes.UUIDV4,
//     allowNull: false
//   }
// }, {
// 	timestamps: false
// });


// PostSubscriptionGroup.belongsTo(Post);

// // module.exports = PostSubscriptionGroup;
// export default PostSubscriptionGroup;


module.exports = (sequelize, DataTypes) => {
  const PostSubscriptionGroup = sequelize.define('PostSubscriptionGroup', {
	  id: { 
	    type: DataTypes.UUID, 
	    primaryKey: true, 
	    defaultValue: DataTypes.UUIDV4,
	    allowNull: false
	  }
  }, {
  	timestamps: false
  });

  PostSubscriptionGroup.associate = (models) => {
    PostSubscriptionGroup.belongsTo(models.Post);
  }

  return PostSubscriptionGroup;
};