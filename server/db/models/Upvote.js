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