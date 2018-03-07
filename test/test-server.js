/* eslint-env node, mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();

chai.use(chaiHttp);

it('should get config /config GET', (done) => {
  chai.request(server)
    .get('/config')
    .end((err, res) => {
      console.log(res.body);
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('host');
      res.body.should.have.property('dbname');
      res.body.should.have.property('username');
      res.body.should.have.property('password');
      res.body.should.have.property('port');
      res.body.should.have.property('dialect');
      done();
    });
});
