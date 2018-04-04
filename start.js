const cluster = require('cluster');
const app = require('./app');
const fs = require('fs');
const https = require('https');
const debug = require('debug')('app');

const cpuCount = require('os').cpus().length; // Count the CPUs

// setup certificates
const options = {
  cert: fs.readFileSync('/certificate/fullchain.pem'),
  key: fs.readFileSync('/certificate/privkey.pem'),
};

// Log environment to console
debug(`env: ${app.get('env')}`);

if (cluster.isMaster) {
  // Create worker for each CPU
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // handle unwanted worker exits
  cluster.on('exit', (worker, code) => {
    if (code !== 0) {
      debug('Worker crashed! Spawning a replacement.');
      cluster.fork();
    }
  });
} else {
  https.createServer(options, app).listen(8443);
  debug('Server listening on port 8443');
}
