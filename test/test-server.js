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

describe('GET /config', () => {
  it('should get empty config /config GET', (done) => {
    chai.request(server)
      .get('/config')
      .end((err, res) => {
      // console.log(res.body);
        res.should.have.status(200);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('study_id');
        res.body.should.not.have.property('api_key');
        res.body.should.not.have.property('mysql_ip');
        res.body.should.not.have.property('mysql_port');
        res.body.should.not.have.property('mysql_user');
        res.body.should.not.have.property('mysql_pass');
        res.body.should.not.have.property('mysql_database');
        done();
      });
  });
});

describe('POST /insert', () => {
  it('should insert new valid data', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        data: validJson,
        deviceId: 'c2b15267-dbd0-434b-8c7c-ce33e3fc60d8',
        tableName: 'accelerometerDevice',
        timestamp: 1523371383870,
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
        data: '{}',
        deviceId: 'c2b15267-dbd0-434b-8c7c-ce33e3fc60d8',
        timestamp: 1523371383870,
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: tableName not defined.');
        done();
      });
  });

  it('should give error about missing data', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        deviceId: 'c2b15267-dbd0-434b-8c7c-ce33e3fc60d8',
        tableName: 'accelerometerDevice',
        timestamp: 1523371383870,
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

  it('should give error about missing deviceId', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        data: '{}',
        tableName: 'accelerometerDevice',
        timestamp: 1523371383870,
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: deviceId not defined.');
        done();
      });
  });

  it('should give error about missing timestamp', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        data: '{}',
        deviceId: 'c2b15267-dbd0-434b-8c7c-ce33e3fc60d8',
        tableName: 'accelerometerDevice',
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
        data: '{}',
        deviceId: 'c2b15267-dbd0-434b-8c7c-ce33e3fc60d8',
        tableName: '',
        timestamp: 1523371383870,
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: tableName not defined.');
        done();
      });
  });

  it('should not allow empty timestamp', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        data: '{}',
        deviceId: 'c2b15267-dbd0-434b-8c7c-ce33e3fc60d8',
        tableName: 'accelerometerDevice',
        timestamp: '',
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

  it('should not allow empty deviceId', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        data: '{}',
        deviceId: '',
        tableName: 'accelerometerDevice',
        timestamp: 1523371383870,
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: deviceId not defined.');
        done();
      });
  });

  it('should not allow empty data', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        data: '',
        deviceId: 'c2b15267-dbd0-434b-8c7c-ce33e3fc60d8',
        tableName: 'accelerometerDevice',
        timestamp: 1523371383870,
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
        data: invalidJson,
        deviceId: 'c2b15267-dbd0-434b-8c7c-ce33e3fc60d8',
        tableName: 'accelerometerDevice',
        timestamp: 1523371383870,
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

  it('should not allow invalid deviceId', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        data: '{}',
        deviceId: 'cf951349--447c-8764-c118fde9ed73',
        tableName: 'accelerometerDevice',
        timestamp: 1523371383870,
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: deviceId field is not valid UUID 128bit.');
        done();
      });
  });

  it('should not allow invalid timestamp', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        data: '{}',
        deviceId: 'c2b15267-dbd0-434b-8c7c-ce33e3fc60d8',
        tableName: 'accelerometerDevice',
        timestamp: '12. March Year: 1997',
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

  it('should not allow invalid timestamp (negative number)', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        data: '{}',
        deviceId: 'c2b15267-dbd0-434b-8c7c-ce33e3fc60d8',
        tableName: 'accelerometerDevice',
        timestamp: -500,
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
        data: '{}',
        deviceId: 'c2b15267-dbd0-434b-8c7c-ce33e3fc60d8',
        tableName: 'qwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdfghjklzqwertyuiopasdf',
        timestamp: 1523371383870,
      })
      .end((err, res) => {
        res.should.have.status(400);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(false);
        res.body.should.have.property('message');
        res.body.message.should.equal('Bad request: tableName is not valid.');
        done();
      });
  });

  it('table name length of 64 should pass', (done) => {
    chai.request(server)
      .post('/insert')
      .send({
        data: '{}',
        deviceId: 'c2b15267-dbd0-434b-8c7c-ce33e3fc60d8',
        tableName: '1234567890123456789012345678901234567890123456789012345678901230',
        timestamp: 1523371383870,
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
});
