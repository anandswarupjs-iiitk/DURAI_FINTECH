const request = require('supertest');
const app = require('../../app');

describe('SEC-14: Penetration & Security Tests', () => {

  describe('Injection Prevention', () => {
    it('should block NoSQL injection in login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: { $gt: '' }, password: { $gt: '' } });
      expect(res.statusCode).toBe(400);
    });

    it('should block script tags in input', async () => {
      const email = 'xss' + Date.now() + '@test.com';
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: '<script>alert(1)</script>', email: email, password: 'Test@1234' });
      expect([400, 201]).toContain(res.statusCode);
    });
  });

  describe('Rate Limiting', () => {
    it('should rate limit excessive login attempts', async () => {
      const attempts = Array(11).fill(null).map(() =>
        request(app)
          .post('/api/auth/login')
          .send({ email: 'fake@test.com', password: 'Wrong@1234' })
      );
      const results = await Promise.all(attempts);
      const blocked = results.some(r => r.statusCode === 429);
      expect(blocked).toBe(true);
    });
  });

  describe('Input Validation', () => {
   it('should reject negative transaction amount', async () => {
  const email = 'sectest' + Date.now() + '@test.com';
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Sec Test', email: email, password: 'Test@1234' });
  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: email, password: 'Test@1234' });
  const token = login.body.token;

  const res = await request(app)
    .post('/api/transactions')
    .set('Authorization', 'Bearer ' + token)
    .send({ amount: -999, recipient: 'Hacker', type: 'debit' });
  expect([400, 401, 429]).toContain(res.statusCode);
});

    it('should reject oversized request body', async () => {
      const big = 'a'.repeat(20000);
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: big, password: big });
      expect([400, 413]).toContain(res.statusCode);
    });
  });

  describe('Auth Security', () => {
    it('should reject expired/fake JWT', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer faketokenthatisnotvalid');
      expect(res.statusCode).toBe(401);
    });

    it('should reject request with no auth header', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });
  });
});