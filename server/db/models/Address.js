// import Sequelize from 'sequelize';

// import connection from '../db';
// import User from './UserNew';



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


  Address.associate = (models) => {
   Address.belongsTo(models.User, { onDelete: 'cascade' });
  }

  return Address;
};



// const Address = connection.define('address', {
  // id: { 
  //   type: DataTypes.UUID, 
  //   primaryKey: true, 
  //   defaultValue: DataTypes.UUIDV4,
  //   allowNull: false
  // },

  // country: DataTypes.STRING,

  // state: DataTypes.STRING,

  // city: DataTypes.STRING,

  // dateFrom: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },

  // dateTo: { type: DataTypes.DATE }
  
// });



// export default Address;
// module.exports = Address;