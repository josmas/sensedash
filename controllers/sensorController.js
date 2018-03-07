const knex = require('knex')(require('../config'));
const config = require('../config.json');

// todo: could be relocated
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

// The sensorController controller.
const sensorController = {};

// todo: proper error handling!
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
      message: 'Bad request: Data field is not valid json data.',
    });
  } else {
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
        .then((resultId) => {
          res.status(201).json({ success: true, message: `Inserted with Id: ${resultId}` });
        });
    });
  }
};

sensorController.getConfig = (req, res) => {
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(config));
};

module.exports = sensorController;
