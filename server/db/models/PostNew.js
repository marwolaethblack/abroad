// import DataTypes from 'sequelize';
// import paginate from 'mongoose-paginate'; // ???

// import connection from '../db';
// import User from './UserNew';
// import Reaction from './Reaction';
// import Upvote from './Upvote';
// import EntityType from './EntityType';


// const Post = connection.define('post', {
//   id: { 
//     type: DataTypes.UUID, 
//     primaryKey: true, 
//     defaultValue: DataTypes.UUIDV4,
//     allowNull: false
//   },

//   countryFrom: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },

//   countryIn: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },

//   title: { 
//     type: DataTypes.STRING,
//     allowNull: false,
//     len: [5,100]
//   },

//   category: { type: DataTypes.STRING, allowNull: false },

//   content: { type: DataTypes.TEXT, allowNull: false },

//   image: DataTypes.STRING,

//   isAnswered: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

//   map: DataTypes.JSON
// });


// Post.belongsTo(User, { foreignKey: "authorId" });
// Post.belongsTo(EntityType);
// Post.hasMany(Reaction);
// // Post.hasMany(Upvote);

// // connection.sync().then(()=> console.log("SUCCESS")).catch(err=>console.log("FUCK sync: "+err))  

// export default Post;
// module.exports = Post;


module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },

    countryFrom: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },

    countryIn: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },

    title: { 
      type: DataTypes.STRING,
      allowNull: false,
      len: [5,100]
    },

    category: { type: DataTypes.STRING, allowNull: false },

    content: { type: DataTypes.TEXT, allowNull: false },

    image: DataTypes.STRING,

    isAnswered: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    map: DataTypes.JSON
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: "authorId" });
    Post.belongsTo(models.EntityType);
    Post.hasMany(models.Reaction);
  }

  return Post;
};


