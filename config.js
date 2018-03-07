const jsonConfig = require('./config.json');

module.exports = {

  client: jsonConfig.development.dialect,
  connection: {
    user: jsonConfig.development.username,
    password: jsonConfig.development.password,
    host: jsonConfig.development.host,
    database: jsonConfig.development.dbname,
  },
  /*
  development: {
    client: jsonConfig.development.dialect,
    connection: {
      user: jsonConfig.development.username,
      password: jsonConfig.development.password,
      host: jsonConfig.development.host,
      database: jsonConfig.development.dbname,
    },
  },
  */

/*
  testing: {
    client: jsonConfig.testing.dialect,
    connection: {
      user: jsonConfig.testing.username,
      password: jsonConfig.testing.password,
      host: jsonConfig.testing.host,
      database: jsonConfig.testing.dbname,
    },
  },
*/
};
