const cluster = require('cluster');
const app = require('./app');

const cpuCount = require('os').cpus().length; // Count the CPUs

// Log environment to console
console.log(`env: ${app.get('env')}`);

if (cluster.isMaster) {
  // Create worker for each CPU
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // handle unwanted worker exits
  cluster.on('exit', (worker, code) => {
    if (code !== 0) {
      console.log('Worker crashed! Spawning a replacement.');
      cluster.fork();
    }
  });
} else {
  app.set('port', process.env.PORT || 3000);
  const server = app.listen(app.get('port'), () => {
    console.log(`${process.pid}: Running → PORT ${server.address().port}`);
  });
}
