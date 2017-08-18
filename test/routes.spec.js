const chai = require('chai');
const should = chai.should();
const expect = chai.expect();
const chaiHttp = require('chai-http');
const server = require('../server');
const folders = require('./folders');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should pass a dummy test', () =>{
    chai.request(server)
      .get('/')
      .end((err, response) => {
        expect(2).toEqual(2);
      })
  })

  it.skip('should return the homepage with text', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.should.equal('We\'re going to test all the routes!');
      done();
    })
  })
});

describe('API Routes', () => {
  before((done) => {
    // run migrations
    done();
  })

  beforeEach((done) => {
    // run your seed files
    server.locals.students = students;
    done();
  })

  describe('GET /api/v1/students', (done) => {
    it.skip('should return all of the students', (done) => {
      chai.request(server)
        .get('/api/v1/students')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.have.property('lastname');
          response.body[0].lastname.should.equal('Turing');
          response.body[0].should.have.property('program');
          response.body[0].program.should.equal('FE');
          response.body[0].should.have.property('enrolled');
          response.body[0].enrolled.should.equal(true);
          done();
        })
    })
  })

  describe('GET /api/v1/students/Babbage', (done) => {
    it.skip('should return the student named Babbage', (done) => {
      chai.request(server)
        .get('/api/v1/students/Babbage')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('lastname');
          response.body[0].lastname.should.equal('Babbage');
          response.body[0].should.have.property('program');
          response.body[0].program.should.equal('BE');
          response.body[0].should.have.property('enrolled');
          response.body[0].enrolled.should.equal(false);
          done();
        })
    })
  })

  describe('POST /api/v1/students', () => {
    it.skip('should create a new student', (done) => {
      chai.request(server)
        .post('/api/v1/students')
        .send({
          lastname: 'Knuth',
          program: 'FE',
          enrolled: true
        })
        .end((err, response) => {
          response.should.have.status(201); // Different status here
          response.body.should.be.a('object');
          response.body.should.have.property('lastname');
          response.body.lastname.should.equal('Knuth');
          response.body.should.have.property('program');
          response.body.program.should.equal('FE');
          response.body.should.have.property('enrolled');
          response.body.enrolled.should.equal(true);
          chai.request(server)
            .get('/api/v1/students')
            .end((err, response) => {
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('array');
              response.body.length.should.equal(4);
              response.body[3].should.have.property('lastname');
              response.body[3].lastname.should.equal('Knuth');
              response.body[3].should.have.property('program');
              response.body[3].program.should.equal('FE');
              response.body[3].should.have.property('enrolled');
              response.body[3].enrolled.should.equal(true);
              done();
            })
        })
    })

    it.skip('should not create a student with missing data', (done) => {
      chai.request(server)
        .post('/api/v1/students')
        .send({
          lastname: 'Knuth',
          program: 'FE' // leave out enrolled
        })
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('You are missing data!');
          done();
        })
    })
  })

});
