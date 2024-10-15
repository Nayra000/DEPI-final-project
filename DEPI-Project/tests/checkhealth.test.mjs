import request from 'supertest';
import index from '../index';
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
});
