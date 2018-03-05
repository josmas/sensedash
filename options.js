// https://stackoverflow.com/questions/22348705/best-way-to-store-db-config-in-node-js-express-app
const fs = require('fs');

const configPath = './config.json';

const parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
exports.storageConfig = parsed;
