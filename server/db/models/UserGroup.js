// import DataTypes from 'sequelize';

// import connection from '../db';
// import User from './UserNew';
// import PostSubscriptionGroup from './PostSubscriptionGroup';


// const UserGroup = connection.define('userGroup', {
//   id: { 
//     type: DataTypes.UUID, 
//     primaryKey: true, 
//     defaultValue: DataTypes.UUIDV4,
//     allowNull: false
//   }
// }, {
// 	timestamps: true,
// 	updatedAt: false,
// 	paranoid: true
// });


// UserGroup.belongsTo(User);
// UserGroup.belongsTo(PostSubscriptionGroup);

// export default UserGroup;
// module.exports = UserGroup;


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