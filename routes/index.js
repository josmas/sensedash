const express = require('express');

const sensorController = require('../controllers/sensorController');

const router = express.Router();

router.get('/config', sensorController.getConfig);
router.post('/insert', sensorController.addData);

module.exports = router;
