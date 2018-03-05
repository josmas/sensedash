const Sensor = require('../models/Sensor');

const Sequelize = require('sequelize');

const config = require('../config');

const db = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  config.db.details,
);

// The authentication controller.
const sensorController = {};

sensorController.addData = (req, res) => {
  if (!req.body.timestamp) {
    res.status(400).json({
      message: 'Bad request: timestamp not defined.',
    });
  } else if (!req.body.device_id) {
    res.status(400).json({
      message: 'Bad request: device_id not defined.',
    });
  } else if (!req.body.data) {
    res.status(400).json({
      message: 'Bad request: data not defined.',
    });
  } else if (!req.body.table) {
    res.status(400).json({
      message: 'Bad request: table not defined.',
    });
  } else {
    db.sync().then(() => {
      const newSensor = {
        timestamp: req.body.timestamp,
        device_id: req.body.device_id,
        data: req.body.data,
      };
      return Sensor.create(newSensor).then(() => {
        res.status(201).json({
          message: 'Sensor data added!',
        });
      });
    }).catch((error) => {
      res.status(403).json({
        message: error,
      });
    });
  }
};

sensorController.getConfig = (req, res) => {
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(config));
};


module.exports = sensorController;
