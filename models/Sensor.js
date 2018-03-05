const Sequelize = require('sequelize');

const config = require('../config');

const db = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  config.db.details,
);

// The model schema.
const modelDefinition = {
  timestamp: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  device_id: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  data: {
    type: Sequelize.JSON,
    allowNull: false,
  },
};

// The model options.
const modelOptions = {
};

// Define the model.
const SensorModel = db.define('Test', modelDefinition, modelOptions);

db.sync({ force: false })
  .catch((err) => {
    throw err;
  });

module.exports = SensorModel;
