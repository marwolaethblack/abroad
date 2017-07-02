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
  }

  return Notification;
};