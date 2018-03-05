const express = require('express');

const sensorController = require('../controllers/sensorController');

const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.send('It works!');
});

// router.get('/config', sensorController.getConfig);
router.post('/insert', sensorController.addData);

module.exports = router;
