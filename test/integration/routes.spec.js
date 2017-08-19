process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const knex = require('../../src/server/db/knex');

describe('Testing API Routes', () => {

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
        res.status.should.eql(200);
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
        res.status.should.eql(200);
        res.type.should.eql('application/json');
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
        res.status.should.eql(404);
        res.type.should.eql('application/json');
        res.body.should.include.keys('error');
        res.body.error.should.eql('That folder does not exist.');
        done();
      });
    });
  });

  describe('POST /api/v1/folders', () => {
    it('should respond with a success message and the newly created folder', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({
        name: 'Memes',
        description: 'All the funniest memes'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(201);
        res.type.should.eql('application/json');
        res.body.status.should.eql('success');
        res.body.data.should.include.keys(
          'id', 'name', 'description', 'created_at', 'updated_at'
        );
        res.body.data.name.should.eql('Memes');
        res.body.data.description.should.eql('All the funniest memes');
        done();
      });
    });
  });

  describe('GET /api/v1/links', () => {
    it('should respond with all links for all folders', (done) => {
      chai.request(server)
      .get('/api/v1/links')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(2);
        res.body.data[0].should.include.keys(
          'id', 'url', 'short_url', 'folder_id', 'created_at', 'updated_at'
        );
        res.body.data[0].folder_id.should.eql(1);
        res.body.data[0].url.should.eql('http://www.bestrecipes.com');
        res.body.data[0].short_url.should.eql('http://www.jetfuel.com/qwerty');
        done();
      });
    });
  });

  describe('GET /api/v1/folders/:folder_id/links', () => {
    it('should respond with all links for a specific folder', (done) => {
      chai.request(server)
      .get('/api/v1/folders/1/links')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(2);
        res.body.data[0].should.include.keys(
          'id', 'url', 'short_url', 'folder_id', 'created_at', 'updated_at'
        );
        res.body.data[0].folder_id.should.eql(1);
        res.body.data[0].url.should.eql('http://www.bestrecipes.com');
        res.body.data[0].short_url.should.eql('http://www.jetfuel.com/qwerty');
        done();
      });
    });

    it('should respond with no links for a specific folder', (done) => {
      chai.request(server)
      .get('/api/v1/folders/2/links')
      .end((err, res) => {
        should.exist(err);
        console.log(res.body);
        res.status.should.eql(404);
        res.type.should.eql('application/json');
        res.body.should.include.keys('error');
        res.body.error.should.eql('No links have been added to this folder yet.');
        done();
      });
    });
  });

  describe('POST /api/v1/links', () => {
    it('should respond with a success message and the newly created link', (done) => {
      chai.request(server)
      .post('/api/v1/links')
      .send({
        url: 'http://www.google.com',
        short_url: 'http://www.jetfuel.com/goog',
        folder_id: 1
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(201);
        res.type.should.eql('application/json');
        res.body.status.should.eql('success');
        res.body.data.should.include.keys(
          'id', 'folder_id', 'url', 'short_url', 'created_at', 'updated_at'
        );
        res.body.data.folder_id.should.eql(1);
        res.body.data.url.should.eql('http://www.google.com');
        res.body.data.short_url.should.eql('http://www.jetfuel.com/goog');
        done();
      })
    })
  })

});