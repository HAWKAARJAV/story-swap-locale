const request = require('supertest');
const { buildTestToken } = require('./testUtils');
const app = require('../server');

describe('AgentX Chat Route', () => {
  const base = `/api/${process.env.API_VERSION || 'v1'}/agentx`;
  let token;

  beforeAll(() => {
    token = buildTestToken();
  });

  test('rejects unauthenticated requests', async () => {
    const res = await request(app).post(`${base}/chat`).send({ message: 'Hello' });
    expect(res.status).toBe(401);
  });

  test('returns 400 when message missing', async () => {
    const res = await request(app)
      .post(`${base}/chat`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('returns themed reply for mountain prompt', async () => {
    const res = await request(app)
      .post(`${base}/chat`)
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Plan a mountain trek with heritage vibes' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.content).toMatch(/mountain adventure|cultural exploration/i);
    expect(res.body.id).toBeDefined();
  });
});
