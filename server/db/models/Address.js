module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },

    country: DataTypes.STRING,

    state: DataTypes.STRING,

    city: DataTypes.STRING,

    dateFrom: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

    dateTo: { type: DataTypes.DATE }
  }, {
    timestamps: false
  });

  return Address;
};