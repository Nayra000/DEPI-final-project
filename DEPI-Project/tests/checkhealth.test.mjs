import request from 'supertest';
import index from '../index.js';
import { expect } from 'chai';

describe('Check Health API', () => {
  describe('GET /api/v1/test', () => {
    it('should return a success message', (done) => {
      request(index)
        .get('/api/v1/test')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).to.equal('success');
          done();
        });
    });
  });

  describe('POST /api/v1/users/singin', () => {
    it('should login to my account successfully', async () => {
      const res = await request('http://localhost:5000')
        .post('/api/v1/users/singin')
        .send({
          email: 'ma2001129@gmail.com',
          password: 'ma2001129@gmail.com',
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

        expect(res.body.status).to.equal('success');
      expect(res.body).to.have.property('token');
      expect(res.body.data).to.have.property('user');
      expect(res.body.data.user.name).to.equal('Mohamed Alaa');
    });
  });
});
