const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'development']);
const validator = require('validator');

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
  if (!req.body.timestamp) {
    res.status(400).json({
      success: false,
      message: 'Bad request: timestamp not defined.',
    });
  } else if (!req.body.device_id) {
    res.status(400).json({
      success: false,
      message: 'Bad request: device_id not defined.',
    });
  } else if (!req.body.data) {
    res.status(400).json({
      success: false,
      message: 'Bad request: data not defined.',
    });
  } else if (!req.body.table) {
    res.status(400).json({
      success: false,
      message: 'Bad request: table not defined.',
    });
  } else if (!isJson(req.body.data)) {
    res.status(400).json({
      success: false,
      message: 'Bad request: data field is not valid json data.',
    });
  } else if (!validDeviceId(req.body.device_id)) {
    res.status(400).json({
      success: false,
      message: 'Bad request: device_id field is not valid UUID 128bit.',
    });
  } else if (!isUnixTimestamp(req.body.timestamp)) {
    res.status(400).json({
      success: false,
      message: 'Bad request: timestamp field is not valid unix timestamp.',
    });
  } else if (!isValidTableName(req.body.table)) {
    res.status(400).json({
      success: false,
      message: 'Bad request: table name is not valid.',
    });
  } else {
    // setTimeout(() => {
    // eslint-disable-next-line consistent-return
    knex.schema.hasTable(req.body.table).then((exists) => {
      if (!exists) { // create table
        return knex.schema.createTable(req.body.table, (t) => {
          t.increments('id').primary();
          t.string('timestamp', 100);
          t.string('device_id', 100);
          t.json('data');
        });
      }
    }).then(() => {
      knex(req.body.table).insert({
        timestamp: req.body.timestamp,
        device_id: req.body.device_id,
        data: req.body.data,
      })
        .then(() => {
          res.status(201).json({ success: true });
        });
    })
      .catch((error) => {
        res.status(201).json({ success: false, message: 'Error: Database connection error.' });
        console.log(error);
      });
    // }, 0);
  }
};

sensorController.getConfig = (req, res) => {
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify('')); // todo : should not be empty
};

module.exports = sensorController;
