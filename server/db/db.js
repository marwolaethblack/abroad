import fs from 'fs'; 
import path from 'path';
import Sequelize from 'sequelize';

import dbConfig from './config/database.json';


const env = process.env.NODE_ENV || 'development';
const dbUrl = dbConfig[env].url;
const connection = new Sequelize(dbUrl);

connection
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    connection.sync({ force: true });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default connection;