<!-- source: SECURITY.md; source-sha256: eff1c4ef3dc73583a72008905aad166fc410b634463e4f9aab54070721cc0a9f -->

# مدل امنیتی و چک‌لیست تولید

[English](SECURITY.md) | [فارسی](SECURITY.fa.md)

## مرز اعتماد

مرورگر و تمام داده‌ها، permissionها و محاسبات آن غیرقابل اعتمادند. API مرجع هویت، مجوز، قیمت، موجودی، ledger و transition است. HTTPS/WSS، cookie امن، validation سرور، audit و rate limit مسئولیت استقرار واقعی هستند.

## احراز هویت و مجوز

access token کوتاه‌عمر فقط در حافظه است و refresh session باید cookie از نوع HttpOnly، Secure و SameSite مناسب با rotation و reuse detection باشد. بازیابی، MFA، session revocation و password change به rate limit، audit و step-up نیاز دارند. UI مبتنی بر permission فقط presentation است؛ هر endpoint باید مالکیت و permission action را در سرور اعمال کند.

## عملیات مالی

نرخ، fee، quantity، balance و نتیجهٔ settlement از client پذیرفته نمی‌شوند. quote باید opaque، کوتاه‌عمر و متعلق به کاربر باشد. mutation مالی به idempotency، transaction با precision ثابت، ledger متوازن، concurrency control و audit نیاز دارد. withdrawal علاوه بر MFA به custody، address policy، risk/sanctions screening و approval نیاز دارد.

## ورودی، خروجی و حریم خصوصی

همهٔ ورودی‌ها در server دوباره validate می‌شوند؛ upload به محدودیت نوع/اندازه، اسکن و object storage خصوصی نیاز دارد. پیام server مستقیماً render نمی‌شود و فقط error code مجاز محلی می‌شود. secret، token، PII کامل و identifier حساس نباید در log، URL، analytics یا screenshot قرار گیرد.

## الزامات پیش از تولید

CSP و headerهای امنیتی، TLS، CSRF/CORS درست، secret management، backup و recovery، monitoring و alert، dependency/container scanning، penetration test، incident response، retention policy و بازبینی حقوقی/KYC/AML باید خارج از ادعای فرانت‌اند تکمیل شوند. انتشار فقط با اجرای آزمون‌ها و بازبینی تغییر contract و trust boundary مجاز است.
