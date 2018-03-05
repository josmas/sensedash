const express = require('express');

const bodyParser = require('body-parser');

const routes = require('./routes/index');

/*
const options = require('./options');

const loginData = {
  host: options.storageConfig.HOST,
  user: options.storageConfig.user,
  password: options.storageConfig.password,
};
*/

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

app.listen(3000);
