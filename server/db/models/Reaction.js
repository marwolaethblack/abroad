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
    Reaction.hasMany(models.Comment, { onDelete: 'cascade' });
  }

  return Reaction;
};