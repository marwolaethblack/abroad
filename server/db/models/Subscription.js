module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },

    countryFrom: DataTypes.STRING,

    countryIn: DataTypes.STRING,

    categories: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    timestamps: true,
    paranoid: true
  });

  return Subscription;
};