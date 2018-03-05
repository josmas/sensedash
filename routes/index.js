const express = require('express');

const sensorController = require('../controllers/sensorController');
const configController = require('../controllers/configController');

const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.send('It works!');
});

router.get('/config', configController.getConfig);
router.post('/insert', sensorController.addData);

module.exports = router;
