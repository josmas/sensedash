// Update with your config settings.

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
      host: 'mysql',
      database: 'defaultdb',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

};
