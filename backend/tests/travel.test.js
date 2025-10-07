const request = require('supertest');
const { buildTestToken } = require('./testUtils');
const app = require('../server');

describe('Travel Planner & Emotion Analysis', () => {
  const base = `/api/${process.env.API_VERSION || 'v1'}/travel`;
  let token;

  beforeAll(() => {
    token = buildTestToken({ email: 'hawk@example.com' });
  });

  test('generates adventure plan from mood', async () => {
    const res = await request(app)
      .post(`${base}/plan`)
      .set('Authorization', `Bearer ${token}`)
      .send({ currentMood: 'adventure thrill', userInput: 'Need a rugged trek', userId: 'u1' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.destination).toBeDefined();
  });

  test('falls back gracefully with unknown mood', async () => {
    const res = await request(app)
      .post(`${base}/plan`)
      .set('Authorization', `Bearer ${token}`)
      .send({ currentMood: 'zzzunknownzzz', userInput: '??', userId: 'u2' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('analyzes emotion for cultural keywords', async () => {
    const res = await request(app)
      .post(`${base}/analyze-emotion`)
      .set('Authorization', `Bearer ${token}`)
      .send({ storyTitle: 'Ancient Temple Walk', storyContent: 'Heritage culture history temple carvings' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.emotion).toMatch(/cultural|adventure|romantic|peaceful|exciting|spiritual/);
  });

  test('returns 400 when story content missing', async () => {
    const res = await request(app)
      .post(`${base}/analyze-emotion`)
      .set('Authorization', `Bearer ${token}`)
      .send({ storyTitle: 'Missing content only' });
    expect(res.status).toBe(400);
  });
});
