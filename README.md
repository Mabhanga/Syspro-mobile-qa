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

## Status

All 4 tests pass against the live site (confirmed via `npx playwright codegen`):
- Selectors for the mobile burger menu target Crocoblock/JetEngine's "Jet Mobile Menu" widget (`#jet-mobile-menu-...`), a separate menu structure from the desktop nav and footer.
- The desktop nav test dismisses a cookie-consent banner before interacting, and uses a forced click on the "Careers" link since Playwright's mouse-move-to-click can break the "Insights" hover state mid-action.