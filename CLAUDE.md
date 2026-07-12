@AGENTS.md

# Crypto Trading Dashboard — Project Context

Portfolio project built by Kostandinos Vasilakis (frontend dev, ~3 years experience, job-seeking remote mid-level React roles EU/UK). Built step-by-step in Claude.ai chat with heavy emphasis on **naming and explaining design patterns** as they appear — this is intentional, for interview prep. Keep doing this in Claude Code too.

- **Live URL:** https://crypto-trading-dashboard-theta.vercel.app/
- **Repo:** https://github.com/KostandinosVas/Crypto-Trading-Dashboard

## What it does

Real-time crypto dashboard: live prices via Binance WebSocket, historical candlestick/area charts via Binance REST, a searchable coin list (top 100 by 24h volume), and an AI chatbot (Gemini, function calling) that answers questions using the same live/REST data.

## Tech stack

- Next.js 16 (App Router, Turbopack dev server)
- React 19
- TypeScript (strict — **never use `any`**, always proper/branded types, even in throwaway examples)
- TanStack Query (REST data + caching)
- Zustand (live price store)
- lightweight-charts v5 (TradingView) — note: v5 API is `chart.addSeries(SeriesType, options)`, not the old `chart.addCandlestickSeries(...)`
- Google Gemini API (`@google/genai` SDK) — function/tool calling
- CSS Modules (Tailwind is installed as a fallback but **not used** — house style is CSS Modules)
- Vitest + React Testing Library (unit + component tests)
- GitHub Actions CI (lint + test on every push)
- Deployed on Vercel (Hobby plan)

## Architecture (layered, deliberately)

```
src/
  app/            routes, layout, metadata, opengraph-image.tsx, icon.svg, api/chat/route.ts
  components/     "dumb" UI components (some are Container Components that call hooks)
  hooks/          Facade layer — hides TanStack Query / Zustand / service details from components
  services/
    binance/       rest.ts (REST + Adapter mappers), websocket.ts (Singleton WS manager)
  store/          Zustand store(s) — single source of truth for live price state
  lib/            environment-agnostic: types.ts, colors.ts (literal hex, see gotchas), coinIcon.ts,
                  marketStats.ts (shared pure functions used by both chatbot tools and UI),
                  chatTools.ts (Gemini function declarations), chatToolExecutors.ts (server-side logic)
```

Rule of thumb: `services/` and `lib/` know nothing about React. `hooks/` is the only bridge between them and `components/`. `page.tsx` is pure composition — no business logic.

## Design patterns already in use (name them explicitly if extending)

- **Singleton** — `BinanceWebSocketManager` (one WS connection for the whole app, via `!miniTicker@arr` combined stream covering ALL symbols in one socket)
- **Adapter** — `mapRawKlineToCandle`, ticker mappers in `rest.ts` (raw Binance shape → clean internal types)
- **Facade** — every hook in `hooks/` (e.g. `useHistoricalData`, `usePriceStream`, `useTopTickers`)
- **Observer/Pub-Sub** — Zustand store distributing WS updates to subscribed components
- **Container Component** — `CoinListRow`, `TickerCard`-style components that call hooks themselves so parents don't need to
- **Lifting State Up** — `selectedSymbol` / `interval` state lives in `page.tsx`, passed down
- **Controlled Component** — sidebar row selection (`isSelected`/`onSelect` props, no internal state)
- **Composition** — `page.tsx` just assembles Header + MarketStats + CoinList + Chart + ChatWidget

## Known gotchas / lessons learned (read before debugging similar issues)

1. **`npm ci` fails with missing `@emnapi/*` packages** — this has happened twice. It's an optional/platform-specific dependency lock drift issue, not a real problem with the code. Fix: `rm -rf node_modules package-lock.json && npm install && npm ci` (verify `npm ci` passes clean) before committing. **Always run `npm ci` locally after adding any new package, before pushing** — cheap insurance, catches this before CI does.
2. **GitHub Actions must run `npx vitest run`, not `npm run test`** — the `test` script is `vitest` (watch mode), which hangs forever in CI.
3. **Binance API returns HTTP 451 from US-based IPs** (legal/geo-block). Vercel serverless functions default to `iad1` (US). Fixed via `vercel.json` → `{ "regions": ["fra1"] }`. If any new API route calls Binance and starts 500-ing only in production, check this first.
4. **`next/og` (`opengraph-image.tsx`) only supports inline styles + flexbox** (Satori renderer) — no CSS Modules, no Tailwind, no `var(--custom-property)`. Same constraint applies to any future dynamic OG/icon generation.
5. **`lightweight-charts` canvas rendering ignores CSS custom properties** — `var(--up)` etc. do nothing inside canvas-based colors. Use literal hex from `lib/colors.ts` for anything drawn on canvas (chart series colors, sparklines).
6. **Module-level side effects (e.g. `new WebSocket()` at import time) can run server-side during Next.js SSR** and silently fail if the environment lacks browser globals. Fix pattern used: wrap initialization in a function, guard with `typeof window === 'undefined'`, and call it from inside a `useEffect` (never at module top-level).
7. **Binance klines default to `limit: 500`** — this is why chart range looks shorter at smaller intervals (1h ≈ 3 weeks of data) and longer at bigger intervals (1d ≈ 1.5 years). No pagination implemented yet — deliberately deferred, see Pending below.
8. **External domains use plain `<a>` tags, not `next/link`** (next/link is for internal routing only — prefetching/client-routing has no meaning for external URLs like GitHub).
9. Coin icons come from the `cryptocurrency-icons` npm package via jsDelivr CDN (`lib/coinIcon.ts`), with `onError` fallback to a generic icon — some symbols won't have icons.

## Environment variables

- `GEMINI_API_KEY` — server-side only, used in `src/app/api/chat/route.ts`. Never prefix with `NEXT_PUBLIC_`. Set in both `.env.local` (local dev, gitignored) and Vercel project settings (production).

## Testing conventions established

- Pure functions: direct input/output tests (e.g. `mapRawKlineToCandle`)
- Network calls: mock `global.fetch` with `vi.fn().mockResolvedValue(...)`, always restore `global.fetch = originalFetch` in `afterEach`
- Cross-module dependencies: `vi.mock('@/path', () => ({ ... }))` + `vi.mocked(fn).mockResolvedValue(...)`
- Components: `@testing-library/react` `render`/`screen`, `@testing-library/user-event` for simulated interaction (not raw `fireEvent`)
- `vitest.config.mts` has `globals: true` (required for `@testing-library/jest-dom` matchers to attach to `expect`) and `setupFiles: ['./vitest.setup.ts']`

## Working style / preferences for this person

- Explain new concepts step-by-step, one file/step at a time, wait for confirmation before moving on — especially for topics he's flagged as new to him (Zustand, testing, CI/CD).
- Explicitly name and briefly explain any design pattern or architectural decision as it comes up (interview prep — see patterns list above).
- Never use `any` — he knows TypeScript, treat shortcuts there as a real quality issue, not a convenience.
- Prefers CSS Modules over Tailwind for actual styling.
- Appreciates honest, direct answers over hedging — including admitting when something in a prior explanation was wrong.
- Casual tone, comfortable with profanity/venting when frustrated (e.g. repeated CI failures) — don't be thrown by it, just stay useful and keep debugging methodically (check actual logs/errors, don't guess).

## Pending / not yet done

- Binance klines pagination for longer historical ranges at small intervals (deliberately deferred earlier)
- Mobile/tablet full responsive pass (was attempted once, reverted via `git restore` at his request — starting fresh if revisited)
- More Vitest coverage (only ~6 tests exist: kline mapper, fetchTopTickers, executeGetTopMovers ×2, IntervalSelector ×2)
- Possible refactor: `chatToolExecutors.ts` could reuse `lib/marketStats.ts` (`getTopMover`) instead of its own inline sort — noted as optional, not done
- Next planned portfolio project (separate repo): React + .NET IoT dashboard
