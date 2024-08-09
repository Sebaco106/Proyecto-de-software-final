const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./ruta_a_tu_codigo/index');
const expect = chai.expect;

chai.use(chaiHttp);

describe('API Integration Tests', () => {

  describe('GET /items', () => {
    it('should return all items', (done) => {
      chai.request(server)
        .get('/items')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /items', () => {
    it('should create a new item', (done) => {
      chai.request(server)
        .post('/items')
        .send({ name: 'NewItem', price: 100 })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('id');
          expect(res.body.name).to.equal('NewItem');
          done();
        });
    });
  });

  describe('GET /protected-endpoint', () => {
    it('should return 401 for unauthorized access', (done) => {
      chai.request(server)
        .get('/protected-endpoint')
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  describe('Database Related Tests', () => {
    it('should handle GET /db-items', (done) => {
      chai.request(server)
        .get('/db-items')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('should handle POST /db-items', (done) => {
      chai.request(server)
        .post('/db-items')
        .send({ name: 'TestItem', description: 'Test' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('id');
          done();
        });
    });

    it('should handle DELETE /db-items/:id', (done) => {
      chai.request(server)
        .delete('/db-items/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });
});
