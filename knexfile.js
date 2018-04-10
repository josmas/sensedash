// Update with your config settings.
const config = require('./config/config');
const fs = require('fs');

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
  },

  testing: {
    client: 'sqlite3',
    connection: {
      filename: './test.sqlite3',
    },
  },

  production: {
    client: 'mysql',
    connection: {
      host: config.mysql_ip,
      database: config.mysql_database,
      user: config.mysql_user,
      password: config.mysql_pass,
      ssl: {
        ca: fs.readFileSync('/run/secrets/ca.pem'),
        key: fs.readFileSync('/run/secrets/client-key.pem'),
        cert: fs.readFileSync('/run/secrets/client-cert.pem'),
      },
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

};
