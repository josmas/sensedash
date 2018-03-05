const config = module.exports;

const jsonConfig = require('./config.json');

const loginData = {
  host: jsonConfig.host,
  username: jsonConfig.username,
  password: jsonConfig.password,
  dbname: jsonConfig.dbname,
  port: jsonConfig.port,
  dialect: jsonConfig.dialect,
};

config.db = {
  user: loginData.username,
  password: jsonConfig.password,
  name: loginData.dbname,
};

config.db.details = {
  host: loginData.host,
  port: loginData.port,
  dialect: loginData.dialect,
};
