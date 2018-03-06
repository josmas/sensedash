const express = require('express');

const bodyParser = require('body-parser');

const routes = require('./routes/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

/*
if (app.get('env') === 'development') {
  // Development Error Handler - Prints stack trace
  app.use(errorHandlers.developmentErrors);
}
*/
// production error handler
// app.use(errorHandlers.productionErrors);

app.listen(3000);
