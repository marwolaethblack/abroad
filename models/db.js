import fs from 'fs'; 
import path from 'path';
import Sequelize from 'sequelize';
import { DB_URL } from '../config.js';
const basename = path.basename(module.filename);
const db = {};

let connection = new Sequelize(DB_URL);

// const model = connection.import(path.join(__dirname, 'PostNew.js'));
// db[model.name] = model;

connection
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// fs
//   .readdirSync(__dirname)
//   .filter(file =>

//     (file.indexOf('.') !== 0) &&
//     (file !== basename) &&
//     (file.slice(-3) === '.js') && file === 'Todo.js')
//   .forEach(file => {
//   	console.log("FUCK file: ");
//   	console.log(file);
//     const model = connection.import(path.join(__dirname, file));
//     db[model.name] = model;
//   });


// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

export default connection;