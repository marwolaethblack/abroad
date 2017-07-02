// import DataTypes from 'sequelize';
// import bcrypt from 'bcrypt-nodejs';

// import connection from '../db';


// let User = connection.define('user', {
//     id: { 
//     	type: DataTypes.UUID, 
//     	primaryKey: true, 
//     	defaultValue: DataTypes.UUIDV4,
//       allowNull: false
//     },

//     socialId: { type: DataTypes.STRING , unique: true},

//     provider: { type: DataTypes.STRING },

//     username: { type: DataTypes.STRING, allowNull: false },

//     email: { 
//      type: DataTypes.STRING,
//      allowNull: false,
//      unique: true, 
//      set(val) {
//     	this.setDataValue('email', val.toString().toLowerCase());
//      }
//     },

//     password: { type: DataTypes.STRING, allowNull: false },

//     image: { type: DataTypes.STRING },

//     about: { type: DataTypes.STRING },

//     countryFrom: { type: DataTypes.STRING },

//     lastCheckedNotificationsTime: DataTypes.DATE

//   },
//   {
//     timestamps: true,
//     updatedAt: false,
//     paranoid: true  
//   }
// );

// //instance method of a model must not be an arrow function
// User.prototype.comparePassword = function(candidatePassword, callback) {

//     bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
//       if(err) { 
//         console.log(err);
//         return callback(err) 
//       }

//       return callback(null, isMatch);
//     });
// }

// connection.sync();

// export default User;
// module.exports = User;


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { 
      type: DataTypes.UUID, 
      primaryKey: true, 
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },

    socialId: { type: DataTypes.STRING , unique: true},

    provider: { type: DataTypes.STRING },

    username: { type: DataTypes.STRING, allowNull: false },

    email: { 
     type: DataTypes.STRING,
     allowNull: false,
     unique: true, 
     set(val) {
      this.setDataValue('email', val.toString().toLowerCase());
     }
    },

    password: { type: DataTypes.STRING, allowNull: false },

    image: { type: DataTypes.STRING },

    about: { type: DataTypes.STRING },

    countryFrom: { type: DataTypes.STRING },

    lastCheckedNotificationsTime: DataTypes.DATE
  }, {
    timestamps: true,
    updatedAt: false,
    paranoid: true 
  });

  User.prototype.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if(err) { 
        console.log(err);
        return callback(err) 
      }
      return callback(null, isMatch);
    });
  }

  return User;
};
