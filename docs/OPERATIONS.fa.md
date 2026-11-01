<!-- source: OPERATIONS.md; source-sha256: 687475273e5749e95606a5b135d6fc99243c416d5524d1d7a6508534a0306889 -->

# پیکربندی، استقرار و عملیات

[English](OPERATIONS.md) | [فارسی](OPERATIONS.fa.md)

## توپولوژی و پیکربندی زمان اجرا

artifact فرانت‌اند ایستا و بک‌اند مستقل است. browser از `/api` و `/ws` یا URLهای مطلق معتبر استفاده می‌کند. `public/runtime-config.json` پیش از React و بدون cache دریافت می‌شود و فقط `apiBaseUrl` و `webSocketUrl` عمومی دارد؛ secret هرگز در bundle یا این فایل قرار نمی‌گیرد. config نامعتبر باید fail closed کند.

## یکپارچگی بک‌اند

HTTP و WebSocket باید TLS، CORS/credential و cookie policy سازگار داشته باشند. proxy باید upgrade وب‌سوکت، timeout مناسب، client IP معتبر و headerهای امنیتی را حفظ کند. backend deployment مستقل است و وضعیت آن نباید از deploy موفق frontend استنباط شود.

## build و artifact

`npm ci` و `npm run build` خروجی `dist/` را تولید می‌کنند. artifact باید immutable باشد و فقط `runtime-config.json` در زمان استقرار جایگزین یا mount شود. source map عمومی، secret و فایل محیط محلی نباید منتشر شوند. hash artifact و نسخهٔ backend/config باید قابل ردیابی باشند.

### Vercel و metadata

`vercel.json` fallback SPA را فراهم، `/api` و `/ws` را رزرو و cache config را غیرفعال می‌کند. canonical، Open Graph و Twitter Card برای demo عمومی تعریف شده‌اند؛ URL و تصویر باید با محیط واقعی هماهنگ شوند.

## PWA و reverse proxy

service worker فقط shell و GET بازار را با policy مستند cache می‌کند. auth، profile و mutation مالی cache نمی‌شوند. انتشار باید migration نسخهٔ service worker و پاک‌سازی cache قدیمی را در نظر بگیرد. proxy باید `/api` و `/ws` را پیش از fallback SPA route کند.

## مشاهده‌پذیری

frontend به error tracking با release ID، performance و health بدون PII نیاز دارد. backend باید request correlation، audit، metricهای auth/financial/WebSocket، alert و dashboard داشته باشد. token، credential، payload حساس و identifier کامل log نمی‌شوند.

## انتشار و rollback

پیش از انتشار format، docs check، typecheck، lint، test، coverage، build و E2E متناسب اجرا شود. contract و config با backend بررسی، artifact promotion شود و smoke test پس از deploy انجام گیرد. rollback باید artifact و config شناخته‌شدهٔ قبلی را بازگرداند؛ rollback frontend جای migration یا rollback امن backend را نمی‌گیرد.
