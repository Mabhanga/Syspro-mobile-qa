# syspro-careers-bug

Playwright reproduction of a mobile-only navigation bug on [syspro.com](https://www.syspro.com/).

## Bug

**Steps to reproduce (mobile):**
1. Go to https://www.syspro.com/
2. Tap the burger menu
3. Tap **About**
4. Tap **Careers**

**Expected:** Lands on the live Syspro careers page (`/careers/`).

**Actual:** Lands on a **"Pinpoint"-branded 404 page** — *"The page you were looking for doesn't exist."*

Reproduced on two separate physical devices.

**Contrast cases (all work correctly):**
- Mobile, footer → About → Careers ✅
- Desktop, burger/top nav → About → Careers ✅
- Desktop, footer → About → Careers ✅

Only the **mobile burger-menu** path is broken.

## Suspected root cause

Syspro's current careers page is hosted on Hibob (`syspro.careers.hibob.com`, linked from the site's live footer and desktop nav). The 404 page returned by the mobile burger-menu link is branded **Pinpoint**, a different careers/ATS platform — suggesting Syspro migrated ATS providers at some point, updated the footer and desktop nav links, but left a stale link to the old Pinpoint-hosted careers page in the mobile burger menu.

## Tests

- `BUG: burger menu Careers link leads to a 404` (mobile) — proves the bug
- `CONTROL: footer About > Careers link works correctly` (mobile) — proves the footer path is fine on the same device
- `CONTROL: desktop burger/top nav Careers link works correctly` — proves desktop nav is unaffected
- `CONTROL: desktop footer Careers link works correctly` — proves desktop footer is unaffected

## Running

```bash
npm install
npx playwright install chromium
npm test              # all projects
npm run test:mobile   # mobile-chrome only
npm run test:desktop  # desktop-chrome only
npm run test:headed   # watch it run
```

> Selectors are written role/text-based rather than against brittle CSS classes, but haven't been run against the live DOM yet — if any locator doesn't resolve, `npm run codegen` is the fastest way to fix it up.
