const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../app');
const User = require('../src/models/User');
const Transaction = require('../src/models/Transaction');

let token;
let txnId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fraudguard_test');
  // Register and login
  await User.deleteMany({ email: 'txntest@fraudguard.dev' });
  const reg = await request(app).post('/api/auth/register').send({
    name: 'Txn Tester',
    email: 'txntest@fraudguard.dev',
    password: 'TxnPass123!',
  });
  token = reg.body.data.accessToken;
});

afterAll(async () => {
  await User.deleteMany({ email: 'txntest@fraudguard.dev' });
  await Transaction.deleteMany({});
  await mongoose.connection.close();
});

describe('POST /api/transactions/create', () => {
  it('should create a transaction and return risk score', async () => {
    const res = await request(app)
      .post('/api/transactions/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ recipient: 'Alice', amount: 100, description: 'Test payment' });

    expect(res.status).toBe(201);
    expect(res.body.data.riskScore).toBeDefined();
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(res.body.data.riskLevel);
    txnId = res.body.data.transaction._id;
  });

  it('should reject transaction with no recipient', async () => {
    const res = await request(app)
      .post('/api/transactions/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100 });
    expect(res.status).toBe(400);
  });

  it('should reject negative amount', async () => {
    const res = await request(app)
      .post('/api/transactions/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ recipient: 'Bob', amount: -50 });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/transactions/all', () => {
  it('should return paginated transactions', async () => {
    const res = await request(app)
      .get('/api/transactions/all')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.transactions)).toBe(true);
    expect(res.body.data.pagination).toBeDefined();
  });
});

describe('GET /api/transactions/:id', () => {
  it('should return a single transaction', async () => {
    const res = await request(app)
      .get(`/api/transactions/${txnId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.transaction._id).toBe(txnId);
  });

  it('should 404 for invalid id', async () => {
    const res = await request(app)
      .get('/api/transactions/000000000000000000000000')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});