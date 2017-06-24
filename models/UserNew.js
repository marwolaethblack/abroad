import Sequelize from 'sequelize';
import connection from './db';
const bcrypt = require("bcrypt-nodejs");


let User = connection.define('user', {
    id: { 
    	type: Sequelize.UUID, 
    	primaryKey: true, 
    	defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },

    socialId: { type: Sequelize.STRING , unique: true},

    provider: { type: Sequelize.STRING },

    username: { type: Sequelize.STRING, allowNull: false },

    email: { 
     type: Sequelize.STRING,
     allowNull: false,
     unique: true, 
     set(val) {
    	this.setDataValue('email', val.toString().toLowerCase());
     }
    },

    password: { type: Sequelize.STRING, allowNull: false },

    image: { type: Sequelize.STRING },

    about: { type: Sequelize.STRING },

    countryFrom: { type: Sequelize.STRING },

    countryIn: { type: Sequelize.STRING }

  // subscriptions: { type: Sequelize.ARRAY(Sequelize.UUID), defaultValue: [] },
  },
  {
    updatedAt: false  
  }
);

User.prototype.comparePassword = function(candidatePassword, callback){

    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if(err) { 
        console.log(err);
        return callback(err) 
      }
     return callback(null, isMatch);
    });
}

connection.sync();

module.exports = User;

