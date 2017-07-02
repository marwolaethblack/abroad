const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.json')[env];
const db = {};

var logger = require('tracer').colorConsole({level:'info'});


let sequelize;
if (config.url) {
  logger.info("URL");
  sequelize = new Sequelize(config.url, { dialect: config.dialect });
} else {
  logger.info("not development");
  sequelize = new Sequelize(
    config.database, config.username, config.password, config
  );
}


fs
  .readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    logger.info(file)
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
   logger.info(modelName);
  if (db[modelName].associate) {
    logger.info('associate '+db[modelName]);
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;