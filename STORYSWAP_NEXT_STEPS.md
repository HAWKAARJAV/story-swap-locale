# StorySwap 2.0 – Next Enhancement Steps

This document captures prioritized follow-up tasks after initial AI Travel Planner & Emotion Analysis integration.

## ✅ Recently Added
* AI Travel Planner route (`/api/v1/travel/plan`) with mood-based demo logic
* Emotion analysis endpoint (`/api/v1/travel/analyze-emotion`)
* Frontend Travel Planner page (`/plan`) with chat + mock plan generation
* Navigation updates (Dynamic Island) including Plan Trip & AI quick action
* `EmotionAnalyzer` component (client) for story mood tagging
* Health script, error boundary, stable Vite HMR configuration

## 🔜 High Priority (P1)
1. Persist Trip Plans
   - Create `TripPlan` Mongoose model (or embed in User as subdocument array)
   - POST `/travel/save-plan` should write to DB
   - Add GET `/travel/plans` for user history
2. Story Upload Integration
   - Invoke emotion analysis automatically after draft submission
   - Store `emotion`, `moodScore`, `aiSuggestions` on `Story` model
   - Display emotion badge + suggestions on Story detail view
3. Auth Context Enrichment
   - Track `userMood`, `recentTripPlan`, `moodHistory`
   - Expose setter functions for UI components
4. Secure AI Key Handling
   - Backend proxy for AgentX (avoid exposing key in browser)
   - Add rate limiting + fallback messaging

## 🧪 Testing Improvements (P1)
* Add integration tests for `/travel/plan` and `/travel/analyze-emotion`
* Mock auth user context; verify mood-based branching logic
* Snapshot test for EmotionAnalyzer minimal render states

## ✨ Medium Priority (P2)
1. Planner UX Polish
   - Animated itinerary reveal (Framer Motion stagger)
   - Save / Share buttons functional (persist & copy link)
2. Suggestion Surfacing
   - Under each StoryCard show 1-line AI suggestion tooltip
   - “Plan Similar Trip” deep-link pre-fills mood + tags
3. Offline / Retry Layer
   - Add react-query for caching last plan & user context
   - Exponential retry for transient network errors
4. Accessibility
   - ARIA roles for chat transcript and emotion results
   - Keyboard trap avoidance for dropdown menus

## 🗺️ Longer Term (P3)
* Collaborative Trip Planning (invite friends, shared mood board)
* Multi-day itinerary editing & drag ordering
* Geospatial recommendation engine (similar climate/terrain clustering)
* AI Narrative Generation: Convert saved plan -> first-person “future story outline”
* Emotion Timeline: Visualize mood trends of user stories

## 📦 Data Model Extensions (Draft)
```js
// userTripPlans (new collection)
{
  _id, userId, destination, itinerary: [String], vibe, quote,
  estimatedDuration, bestSeason, emotionalTone, generatedAt,
  source: 'ai|manual', context: { currentMood, previousStories, userInput }
}

// Story (augment existing)
emotion: String,
moodScore: Number,
aiSuggestions: [String]
```

## 🛡️ Security / Hardening
* Hide AgentX key behind backend signed short-lived token
* Add abuse monitoring (suspicious request velocity for planning endpoint)
* Sanitize user input passed to AI provider (remove emails / PII)

## 📊 Telemetry & Analytics
* Event: `trip_plan_generated` (fields: mood, destination, latency)
* Event: `emotion_analyzed` (fields: emotion, score)
* Correlate plan save -> future story creation conversions

## 🚀 Deployment Prep Checklist
| Item | Status |
|------|--------|
| Production build (frontend) | ✅ |
| Env var templates (.env.example) | ⬜ |
| Dockerfiles (api + frontend) | ⬜ |
| CI lint + test workflow | ⬜ |
| Basic uptime / health endpoint | ✅ (`/api/v1/health`) |

## 🧷 Assumptions
* Current AI responses are mock; upgrade path to real provider is planned
* DB schema backward compatible with pre-AI stories

---
Maintainer: StorySwap AI Evolution Log – update this as features graduate.