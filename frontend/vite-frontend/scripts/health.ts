/* Frontend health check: validates backend API availability */
import http from 'http';

const api = process.env.VITE_API_URL || 'http://localhost:3001';
const url = api.replace(/\/$/, '') + '/health';

function get(u: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get(u, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode || 0, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(4000, () => req.destroy(new Error('timeout')));
  });
}

(async () => {
  const start = Date.now();
  try {
    const { status, body } = await get(url);
    const ms = Date.now() - start;
    if (status === 200) {
      try {
        const parsed = JSON.parse(body);
        if (parsed.status === 'healthy') {
          console.log(`✅ Backend healthy in ${ms}ms env=${parsed.environment}`);
          process.exit(0);
        }
      } catch {/* ignore parse errors */}
    }
    console.error('⚠️ Unexpected response:', status, body.slice(0, 200));
    process.exit(2);
  } catch (e: any) {
    console.error('❌ Health check failed:', e.message);
    process.exit(1);
  }
})();
