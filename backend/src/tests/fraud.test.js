const { analyzeTransaction } = require('../src/ai/fraudEngine');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fraudguard_test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Fraud Engine', () => {
  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    ipAddress: '192.168.1.1',
    deviceFingerprint: 'abc123',
    loginAttempts: 0,
  };

  it('should return LOW risk for a normal small transaction', async () => {
    const txn = {
      user: mockUser._id,
      recipient: 'Alice',
      amount: 50,
      ipAddress: '192.168.1.1',
      deviceFingerprint: 'abc123',
    };
    const result = await analyzeTransaction(txn, mockUser, { loginFailures: 0 });
    expect(result.riskLevel).toBe('LOW');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(30);
  });

  it('should detect IP change as a risk factor', async () => {
    const txn = {
      user: mockUser._id,
      recipient: 'Bob',
      amount: 100,
      ipAddress: '10.0.0.99', // Different IP
      deviceFingerprint: 'abc123',
    };
    const result = await analyzeTransaction(txn, mockUser, { loginFailures: 0 });
    expect(result.reasons.some(r => r.includes('IP'))).toBe(true);
    expect(result.score).toBeGreaterThan(0);
  });

  it('should detect device change as a risk factor', async () => {
    const txn = {
      user: mockUser._id,
      recipient: 'Carol',
      amount: 100,
      ipAddress: '192.168.1.1',
      deviceFingerprint: 'zzz999', // Different device
    };
    const result = await analyzeTransaction(txn, mockUser, { loginFailures: 0 });
    expect(result.reasons.some(r => r.includes('device'))).toBe(true);
  });

  it('should return HIGH risk with multiple failure factors', async () => {
    const txn = {
      user: mockUser._id,
      recipient: 'Unknown Person',
      amount: 99999,
      ipAddress: '10.0.0.99',
      deviceFingerprint: 'zzz999',
    };
    const result = await analyzeTransaction(txn, mockUser, { loginFailures: 5, otpFailures: 3 });
    expect(result.riskLevel).toBe('HIGH');
    expect(result.score).toBeGreaterThan(70);
    expect(result.reasons.length).toBeGreaterThan(3);
  });
});