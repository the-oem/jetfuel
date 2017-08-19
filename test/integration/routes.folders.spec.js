process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const knex = require('../../src/server/db/knex');

describe('Testing Routes : folders', () => {

  beforeEach((done) => {
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        knex.seed.run()
        .then(() => {
          done();
        })
      });
    });
  });

  afterEach((done) => {
    knex.migrate.rollback()
    .then(() => {
      done();
    });
  });

  describe('GET /api/v1/folders', () => {
    it('should respond with all folders', (done) => {
      chai.request(server)
      .get('/api/v1/folders')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.eql('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(1);
        res.body.data[0].should.include.keys(
          'id', 'name', 'description', 'created_at', 'updated_at'
        );
        res.body.data[0].name.should.eql('Recipes');
        res.body.data[0].description.should.eql('My favorite recipes');
        done();
      });
    });
  });

  describe('GET /api/v1/folders/:id', () => {
    it('should respond with a single folder', (done) => {
      chai.request(server)
      .get('/api/v1/folders/1')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.status.should.eql('success');
        res.body.data[0].should.include.keys(
          'id', 'name', 'description', 'created_at', 'updated_at'
        );
        res.body.data[0].name.should.eql('Recipes');
        res.body.data[0].description.should.eql('My favorite recipes');
        done();
      });
    });

    it('should respond with an error message indicating the folder does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/folders/2')
      .end((err, res) => {
        should.exist(err);
        res.status.should.equal(404);
        res.type.should.equal('application/json');
        res.body.should.include.keys('error');
        res.body.error.should.eql('That folder does not exist.');
        done();
      });
    });
  });

});
