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
    Post.belongsTo(models.EntityType);
    Post.hasMany(models.Reaction);
  }

  return Post;
};


