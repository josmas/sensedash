// process.env.NODE_ENV = 'test';

/* eslint-env node, mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

const validJson = `{"menu": {
  "id": "file",
  "value": "File",
  "popup": {
    "menuitem": [
      {"value": "New", "onclick": "CreateNewDoc()"},
      {"value": "Open", "onclick": "OpenDoc()"},
      {"value": "Close", "onclick": "CloseDoc()"}
    ]
  }
}}`;

const invalidJson = `{"menu": {
  "id": "file",
  "value": "File",f34taretvver5gfvse^
  "popup": {cqaonrx93842423%#¤%3xc po789cyw
    "menuitem": [
      {"valfsdfdsfds", "onclick": "OpenDoc()"},
      {"value": "Close", "onclick": "CloseDoc()"}
    ]
  }
}}`;

chai.use(chaiHttp);

describe('check that database is empty before continuing', () => {
  it('should return empty database', () => {
    // eslint-disable-next-line no-undef
    assert.fail('actual', 'expected', 'Phail');
  });
});


describe('GET /config', () => {
  it('should get config /config GET', (done) => {
    chai.request(server)
      .get('/config')
      .end((err, res) => {
      // console.log(res.body);
        res.should.have.status(200);
        // eslint-disable-next-line no-unused-expressions
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
});

describe('POST /insert', () => {
  it('should insert new data', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '2018121',
        device_id: 'dfa3r23r23',
        data: validJson,
        table: 'testtable',
      })
      .end((err, res) => {
        res.should.have.status(201);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(true);
        res.body.should.have.property('message');
        res.body.message.should.equal('Inserted with Id: 1');
        done();
      });
  });

  it('should give error about missing table', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '2018121',
        device_id: 'dfa3r23r23',
        data: validJson,
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: table not defined.');
        done();
      });
  });

  it('should give error about missing data', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '2018121',
        device_id: 'dfa3r23r23',
        table: 'testtable',
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: data not defined.');
        done();
      });
  });

  it('should give error about missing device_id', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '2018121',
        table: 'testtable',
        data: validJson,
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: device_id not defined.');
        done();
      });
  });

  it('should give error about missing timestamp', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        device_id: 'dfa3r23r23',
        data: validJson,
        table: 'testtable',
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: timestamp not defined.');
        done();
      });
  });

  it('should not allow empty table', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '2018121',
        device_id: 'dfa3r23r23',
        data: validJson,
        table: '',
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: table not defined.');
        done();
      });
  });

  it('should not allow empty timestamp', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '',
        device_id: 'dfa3r23r23',
        data: validJson,
        table: 'testtable',
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: timestamp not defined.');
        done();
      });
  });

  it('should not allow empty device_id', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '2018121',
        device_id: '',
        data: validJson,
        table: 'testtable',
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: device_id not defined.');
        done();
      });
  });

  it('should not allow empty data', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '2018121',
        device_id: 'dfa3r23r23',
        data: '',
        table: 'testtable',
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: data not defined.');
        done();
      });
  });

  it('should not allow invalid json data', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '2018121',
        device_id: 'dfa3r23r23',
        data: invalidJson,
        table: 'testtable',
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: Data field is not valid json data.');
        done();
      });
  });
});
