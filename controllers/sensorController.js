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
    res.json({
      message: 'Please provide sensor timestamp',
    });
  } else if (!req.body.device_id) {
    res.json({
      message: 'Please provide device_id',
    });
  } else if (!req.body.data) {
    res.json({
      message: 'Please provide data',
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

module.exports = sensorController;
