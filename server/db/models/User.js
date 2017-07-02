import bcrypt from 'bcrypt-nodejs';


module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
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

  User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: "authorId", onDelete: 'cascade' });
    User.hasMany(models.Comment, { foreignKey: "authorId", onDelete: 'cascade' });
    User.hasMany(models.Subscription, { onDelete: 'cascade' });
    User.hasMany(models.Notification, { foreignKey: 'ownerId', onDelete: 'cascade' });
    User.hasOne(models.Address, { onDelete: 'cascade' });
  }

  return User;
};
