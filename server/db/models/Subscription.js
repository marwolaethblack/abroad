// import DataTypes from 'sequelize';

// import connection from '../db';
// import User from './UserNew';


// const Subscription = connection.define('subscription', {
//   id: { 
//     type: DataTypes.UUID, 
//     primaryKey: true, 
//     defaultValue: DataTypes.UUIDV4,
//     allowNull: false
//   },

//   countryFrom: DataTypes.STRING,

//   countryIn: DataTypes.STRING,

//   categories: DataTypes.ARRAY(DataTypes.STRING)
  
// },{
//   timestamps: true,
//   paranoid: true
// });

// Subscription.belongsTo(User);

// export default Subscription;
// module.exports = Subscription;


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

  Subscription.associate = (models) => {
    Subscription.belongsTo(models.User, { onDelete: 'cascade' });
  }

  return Subscription;
};