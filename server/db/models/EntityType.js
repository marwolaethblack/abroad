// import DataTypes from 'sequelize';

// import connection from '../db';


// const EntityType = connection.define('entityType', {
//   id: { 
//     type: DataTypes.UUID, 
//     primaryKey: true, 
//     defaultValue: DataTypes.UUIDV4,
//     allowNull: false
//   },

//   typeName: { type: DataTypes.STRING }

// }, {
// 	timestamps: false
// });

// export default EntityType;
// module.exports = EntityType;

module.exports = (sequelize, DataTypes) => {
  const EntityType = sequelize.define('EntityType', {
	id: { 
	    type: DataTypes.UUID, 
	    primaryKey: true, 
	    defaultValue: DataTypes.UUIDV4,
	    allowNull: false
	},
	typeName: { type: DataTypes.STRING }
  }, {
  	timestamps: false
  });
  return EntityType;
};