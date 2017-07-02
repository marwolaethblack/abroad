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
  }

  return Comment;
};