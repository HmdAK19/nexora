<!-- source: TESTING.md; source-sha256: 4d7c579b987d2555d1a3df80a80a0d12d2d014ca89e63f4802485ea048c0f4e7 -->

# راهبرد آزمون

[English](TESTING.md) | [فارسی](TESTING.fa.md)

## پوشش خودکار فعلی

Vitest و Testing Library رفتار unit/component، MSW مرز API، `vitest-axe` دسترس‌پذیری و Playwright جریان‌های smoke را در viewportهای مختلف پوشش می‌دهند. آزمون‌ها باید رفتار و قرارداد را بسنجند، نه جزئیات شکنندهٔ پیاده‌سازی.

## لایه‌ها

- unit برای parser، validator، schema، محاسبه و permission predicate؛
- component برای loading/error/empty/success، فرم، keyboard و هر دو جهت؛
- integration برای auth refresh، query/mutation، cache و runtime validation؛
- E2E برای route حیاتی، responsive، زبان و session؛
- build/type/lint/format برای صحت ایستا و artifact تولید.

## فرمان‌های لازم

`npm run docs:check`، `npm run format:check`، `npm run typecheck`، `npm run lint`، `npm test`، `npm run test:coverage`، `npm run build` و در تغییرهای route/UI مهم `npm run test:e2e` اجرا می‌شوند.

## سناریوهای پرریسک

refresh هم‌زمان و expiry، permission deny-by-default، idempotency پس از timeout، quote expiry، reservation/cancellation، validation upload، masking داده، MFA/recovery code، RTL/LTR، cache نکردن mutation مالی و fail-closed بودن runtime config باید آزمون شوند.

## پوشش‌های پیشنهادی باقی‌مانده

contract test مشترک با بک‌اند، test محیط proxy/CSP/cookie، load/reconnect وب‌سوکت، visual regression دو جهت، chaos test خطاهای شبکه و آزمون واقعی accessibility با assistive technology همچنان برای آمادگی تولید توصیه می‌شوند.
