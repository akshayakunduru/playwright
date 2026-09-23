# Playwright tests

Web tests for [DemoBlaze](https://www.demoblaze.com) and API tests for [Restful-Booker](https://restful-booker.herokuapp.com).

## Setup

Node 18 or newer.

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

`.env` is gitignored. If you leave the defaults, `config/env.config.ts` points at the public sites.

## Run

| Command | What it does |
| --- | --- |
| `npm test` | Web and API |
| `npm run test:web` | DemoBlaze only |
| `npm run test:api` | Restful-Booker only |
| `npm run test:headed` | Web tests with the browser open |
| `npm run report` | HTML report |

Retries are set to 3 in `playwright.config.ts`. The public sites time out often enough that one attempt is noisy. Failed runs keep a trace, screenshot, and video.

## How it's laid out

- `pages/` holds the DemoBlaze page objects. Alerts are `window.alert`, so `BasePage.executeWithDialog()` registers the listener before the click.
- `tests/web` covers signup, login, categories, and checkout.
- `tests/api/booking.spec.ts` covers auth and booking CRUD. The last test chains create, patch, put, and delete.
- `test-data/` has the product names, the checkout form, and booking payloads. Signup users are generated per run (`qa_user_<time>_<random>`) because a fixed username on DemoBlaze is usually already taken.
- `docs/DEMOBLAZE_TEST_ANALYSIS.md` is what I automated and what I left alone.

Web tests run with one worker. The cart lives in the browser session, and running them together steps on that.
