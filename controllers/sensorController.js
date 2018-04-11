const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);
const validator = require('validator');
const config = require('../config/config');
const debug = require('debug')('app');

// Validate device id
function validDeviceId(str) {
  if (validator.isUUID(str)) {
    return true;
  }
  return false;
}

// Validate json
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

// Validate unix timestamp
function isUnixTimestamp(str) {
  if (validator.isInt(str)) {
    if (str < 0) {
      return false;
    }
    return true;
  }
  return false;
}

// validate table name, currently only alphanumeric is accepted with max length of 64
function isValidTableName(str) {
  if (str.length > 64) {
    return false;
  }
  if (validator.isAlphanumeric(str)) {
    return true;
  }
  return false;
}

// The sensorController controller.
const sensorController = {};

sensorController.addData = (req, res) => {
  if (typeof req.body[0] === 'undefined') {
    res.status(400).json({
      success: false,
      message: 'Bad request: body is not defined.',
    });
  } else if (!req.body[0].timestamp) {
    res.status(400).json({
      success: false,
      message: 'Bad request: timestamp not defined.',
    });
  } else if (!req.body[0].deviceId) {
    res.status(400).json({
      success: false,
      message: 'Bad request: deviceId not defined.',
    });
  } else if (!req.body[0].data) {
    res.status(400).json({
      success: false,
      message: 'Bad request: data not defined.',
    });
  } else if (!req.body[0].tableName) {
    res.status(400).json({
      success: false,
      message: 'Bad request: tableName not defined.',
    });
  } else if (!isJson(req.body[0].data)) {
    res.status(400).json({
      success: false,
      message: 'Bad request: data field is not valid json data.',
    });
  } else if (!validDeviceId(req.body[0].deviceId)) {
    res.status(400).json({
      success: false,
      message: 'Bad request: deviceId field is not valid UUID 128bit.',
    });
  } else if (!isUnixTimestamp(req.body[0].timestamp.toString())) {
    res.status(400).json({
      success: false,
      message: 'Bad request: timestamp field is not valid unix timestamp.',
    });
  } else if (!isValidTableName(req.body[0].tableName)) {
    res.status(400).json({
      success: false,
      message: 'Bad request: tableName is not valid.',
    });
  } else {
    // setTimeout(() => {
    // eslint-disable-next-line consistent-return
    knex.schema.hasTable(req.body[0].tableName).then((exists) => {
      if (!exists) { // create table (mysql)
        knex.raw(`CREATE TABLE ${req.body[0].tableName} ( id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, timestamp VARCHAR(255) NOT NULL, deviceId VARCHAR(255) NOT NULL, data MEDIUMTEXT )`)
          .then((rows) => {
            debug(rows);
          })
          .catch(err => debug(err));

        // Table creation for sqlite
        /* return knex.schema.createTable(req.body[0].tableName, (t) => {
            t.increments('id').primary();
            t.string('timestamp', 100);
            t.string('deviceId', 100);
            t.json('data');
          }); */
      }
    }).then(() => {
      knex(req.body[0].tableName).insert({
        timestamp: req.body[0].timestamp,
        deviceId: req.body[0].deviceId,
        data: req.body[0].data,
      })
        .then((dataid) => {
          res.status(201).json({ success: true });
          debug(`Inserted with id: ${dataid}`);
        });
    })
      .catch((error) => {
        res.status(201).json({ success: false, message: 'Error: Database connection error.' });
        debug(error);
      });
    // }, 0);
  }
};

sensorController.getConfig = (req, res) => {
  res.header('Content-Type', 'application/json');
  debug('Sending config');
  res.send(JSON.stringify(config.config));
};

module.exports = sensorController;

