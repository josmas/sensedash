const jsonConfig = require('./config.json')[process.env.NODE_ENV || 'development'];

module.exports = {

  client: jsonConfig.dialect,
  connection: {
    user: jsonConfig.username,
    password: jsonConfig.password,
    host: jsonConfig.host,
    database: jsonConfig.dbname,
  },
};
