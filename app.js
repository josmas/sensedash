const express = require('express');
const bodyParser = require('body-parser');
const errorHandlers = require('./handlers/errorHandlers');
const routes = require('./routes/index');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/', routes);

// Not found error handler
app.use(errorHandlers.notFound);

// Error handler
app.use(errorHandlers.showErrors);

module.exports = app;
