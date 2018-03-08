process.env.NODE_ENV = 'testing';

/* eslint-env node, mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
// const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV || 'testing']);

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

// knex.raw(`DROP DATABASE ${config.dbname}`);
// knex.raw(`CREATE DATABASE ${config.dbname}`);

describe('GET /config', () => {
  it('should get empty config /config GET', (done) => {
    chai.request(server)
      .get('/config')
      .end((err, res) => {
      // console.log(res.body);
        res.should.have.status(200);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        done();
      });
  });
});

describe('POST /insert', () => {
  it('should insert new data', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '1520498512',
        device_id: 'cf951349-19e6-447c-8764-c118fde9ed73',
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
        done();
      });
  });

  it('should give error about missing table', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '1520498512',
        device_id: 'cf951349-19e6-447c-8764-c118fde9ed73',
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
        timestamp: '1520498512',
        device_id: 'cf951349-19e6-447c-8764-c118fde9ed73',
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
        timestamp: '1520498512',
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
        device_id: 'cf951349-19e6-447c-8764-c118fde9ed73',
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
        timestamp: '1520498512',
        device_id: 'cf951349-19e6-447c-8764-c118fde9ed73',
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
        device_id: 'cf951349-19e6-447c-8764-c118fde9ed73',
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
        timestamp: '1520498512',
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
        timestamp: '1520498512',
        device_id: 'cf951349-19e6-447c-8764-c118fde9ed73',
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
        timestamp: '1520498512',
        device_id: 'cf951349-19e6-447c-8764-c118fde9ed73',
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
        res.body.message.should.equal('Bad request: data field is not valid json data.');
        done();
      });
  });

  it('should not allow invalid device_id', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '1520498512',
        device_id: 'cf951349--447c-8764-c118fde9ed73',
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
        res.body.message.should.equal('Bad request: device_id field is not valid UUID 128bit.');
        done();
      });
  });

  it('should not allow invalid timestamp', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '12. March Year: 1997',
        device_id: 'cf951349--447c-8764-c118fde9ed73',
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
        res.body.message.should.equal('Bad request: timestamp field is not valid unix timestamp.');
        done();
      });
  });

  it('should not allow table names longer than 64', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        timestamp: '1520498512',
        device_id: 'cf951349--447c-8764-c118fde9ed73',
        data: validJson,
        table: 'qwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdf',
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: table name is longer than 64 characters.');
        done();
      });
  });
});
