const express = require('express');

const bodyParser = require('body-parser');
const errorHandlers = require('./handlers/errorHandlers');
const routes = require('./routes/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

app.use(errorHandlers.notFound);

// todo :
// app.use(errorHandlers.developmentErrors);

module.exports = app;
