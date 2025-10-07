# TestSprite Integration

This document describes how to exercise the StorySwap backend AI endpoints using the TestSprite MCP server.

## Prerequisites
- Backend running locally (port 3001) — can use `SKIP_DB=1` for speed.
- Node.js 18+
- TestSprite MCP package accessible (it resolves via `npx @testsprite/testsprite-mcp@latest`).
- A JWT token (see below) exported as `TOKEN`.

## 1. Start Backend (Skip DB Mode)
```bash
cd backend
SKIP_DB=1 JWT_SECRET=dummy REFRESH_TOKEN_SECRET=dummy API_VERSION=v1 node server.js
```

## 2. Generate Token
```bash
cd backend/tests/testsprite
node token-gen.js > token.txt
export TOKEN=$(cat token.txt)
```

## 3. Run Scenario Manually (If CLI Supports Direct Execution)
Some TestSprite distributions support a `generateCodeAndExecute` or scenario flag. Example pattern:
```bash
export TESTSPRITE_API_KEY=your-key
npx @testsprite/testsprite-mcp@latest generateCodeAndExecute \
  --scenario ./tests/testsprite/chat-plan-emotion.scenario.json \
  --var TOKEN=$TOKEN
```

If your version lacks flags, run the MCP server:
```bash
export TESTSPRITE_API_KEY=your-key
npx @testsprite/testsprite-mcp@latest server
```
Then use your client to dispatch the scenario with environment variables:
```
TOKEN=$TOKEN BASE_URL=http://localhost:3001 API_VERSION=v1
```

## 4. Scenario Overview
`chat-plan-emotion.scenario.json` executes:
1. Chat without auth (expects 401)
2. Chat with auth (expects success & mountain keyword)
3. Adventure travel plan (expects itinerary array)
4. Emotion analysis with cultural keywords (expects success & emotion field)
5. Emotion analysis missing content (expects 400)

## 5. Customizing
- Change mood: update `currentMood` to `romantic` or `cultural`.
- Extend assertions: add checks like `json.data.destination*` for substring tests.
- Chain variables: if TestSprite supports capturing values, store `destination` for later reuse.

## 6. Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| 401 on all steps | Missing or bad TOKEN | Regenerate token with same secret used for server start |
| 404 endpoints | API_VERSION mismatch | Ensure `API_VERSION=v1` in both env and URLs |
| ECONNREFUSED | Backend not running | Start server or correct port |
| success=false | Validation or payload error | Inspect response JSON for `error` block |

## 7. Security Notes
- Never commit real API keys or tokens inside scenario JSON.
- Use environment substitution for secrets.
- Rotate keys if pasted into shared channels.

## 8. Next Steps
- Add additional scenario for "save plan" endpoint.
- Integrate with CI by scripting scenario runner in a pipeline job.
- Add artifact upload (logs + raw JSON responses) on failure.

---
Happy automated exploring! 🌍
