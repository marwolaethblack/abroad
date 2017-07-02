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