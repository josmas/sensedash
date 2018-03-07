const express = require('express');

const bodyParser = require('body-parser');
const errorHandlers = require('./handlers/errorHandlers');
const routes = require('./routes/index');

const app = express();

// app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

app.use(errorHandlers.notFound);

if (app.get('env') === 'development') {
  // Development Error Handler
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;
