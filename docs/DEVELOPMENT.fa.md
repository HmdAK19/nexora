<!-- source: DEVELOPMENT.md; source-sha256: cd0cabe3dbb9e3017e0b6112bdcd656f0ef070bff9d2db7b77579d902cf8d0ea -->

# راهنمای توسعه

[English](DEVELOPMENT.md) | [فارسی](DEVELOPMENT.fa.md)

## توافق کاری

- بدون درخواست مالک پروژه commit نسازید و برنامه را در browser اجرا نکنید.
- `server/` هرگز track نمی‌شود؛ بک‌اند در مخزن مستقل است.
- تغییرهای نامرتبط worktree را حفظ کنید.
- هر تغییر رفتار، معماری، API، config، امنیت یا وضعیت feature باید مستندات انگلیسی و فارسی را هم‌زمان به‌روز کند.

## افزودن یا تغییر feature

1. رفتار قابل مشاهده و مرجع server/client را تعیین کنید.
2. type و validation خالص را در `model`/`lib` اضافه کنید.
3. transport و query key پایدار را در `api` قرار دهید.
4. orchestration، mutation و اثر cache را به hook بسپارید.
5. page را روی composition و view را تا حد ممکن stateless نگه دارید.
6. keyهای هر دو locale را اضافه کنید.
7. loading، error، empty، disabled، success و retry را پوشش دهید.
8. آزمون و مستندات هر دو زبان را به‌روز کنید.
9. format، typecheck، lint، test و build را اجرا کنید.

## export و style

هر پوشه `index.ts` دارد و feature فقط API عمومی خود را export می‌کند. از import مسیر خصوصی feature دیگر پرهیز کنید. style از tokenهای theme، module مجاور، breakpointهای MUI و propertyهای logical استفاده می‌کند و متن بلند فارسی نباید overflow کند.

## state سرور و localization

query key متعلق به feature است؛ read با TanStack Query و mutation با update/invalidation صریح انجام می‌شود. تغییر موجودی منتظر پاسخ سرور می‌ماند. هر key باید در `en.json` و `fa.json` باشد، plural/interpolation و تاریخ/عدد محلی بررسی شود و ARIA یا خطای انگلیسی hard-code نشود.

## تغییر API و نقشهٔ اسناد

تغییر contract باید هم‌زمان در [API](API.fa.md) شامل method، path، auth، request، response، error عمومی، idempotency و اثر cache ثبت شود. رفتار محصول در `FEATURES`، طراحی ماژول در `ARCHITECTURE`، UI در `DESIGN_SYSTEM`، امنیت در `SECURITY`، آزمون در `TESTING` و استقرار در `OPERATIONS` نگهداری می‌شود.

## تعریف اتمام

تغییر زمانی کامل است که پیاده‌سازی، دو locale برنامه، accessibility، آزمون، هر دو زبان مستندات و کنترل‌های خودکار مرتبط با یکدیگر سازگار باشند. قابلیت وابسته به بک‌اند باید به‌وضوح از سرویس آمادهٔ تولید تفکیک شود.
