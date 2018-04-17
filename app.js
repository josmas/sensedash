const express = require('express');
const bodyParser = require('body-parser');
const errorHandlers = require('./handlers/errorHandlers');
const routes = require('./routes/index');

const app = express();

app.use(bodyParser.json({
  limit: '50mb',
  verify(req, res, buf) {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({
        error: 'not valid json',
      });
    }
  },
}));

app.use('/', routes);

// Not found error handler
app.use(errorHandlers.notFound);

// Error handler
app.use(errorHandlers.showErrors);

module.exports = app;
