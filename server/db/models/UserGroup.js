module.exports = (sequelize, DataTypes) => {
	const UserGroup = sequelize.define('UserGroup', {
		id: { 
		    type: DataTypes.UUID, 
		    primaryKey: true, 
		    defaultValue: DataTypes.UUIDV4,
		    allowNull: false
	  	}
	}, {
		timestamps: true,
		updatedAt: false,
		paranoid: true
  	});

  UserGroup.associate = (models) => {
    UserGroup.belongsTo(models.User, { onDelete: 'cascade' });
	UserGroup.belongsTo(models.PostSubscriptionGroup);
  }

  return UserGroup;
};