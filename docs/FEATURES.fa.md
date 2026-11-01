<!-- source: FEATURES.md; source-sha256: d38c9babbbe17ca6985197415bfbc012f9146848f2dee7f7dfab60f7a2e06c2d -->

# فهرست قابلیت‌ها

[English](FEATURES.md) | [فارسی](FEATURES.fa.md)

این سند مرجع وضعیت رفتار فرانت‌اند است. «یکپارچه‌شده در فرانت‌اند» یعنی UI قرارداد [API](API.fa.md) را پیاده و مصرف می‌کند و به معنی وجود بک‌اند تولیدی نیست.

## نقشهٔ routeها

| route                                               | قابلیت و رفتار                                               |
| --------------------------------------------------- | ------------------------------------------------------------ |
| `/login`، `/register`                               | ورود، حساب نمایشی، بازیابی نشست، reset و ثبت‌نام معتبر       |
| `/`، `/markets`                                     | KPI سبد، نمودار، بازار، جست‌وجو، pagination و virtualization |
| `/trade/:symbol`، `/orders`                         | ticker، OHLCV، عمق، ثبت/لغو سفارش و تاریخچه                  |
| `/wallet`، `/buy-crypto`، `/convert`                | موجودی، انتقال، quote منقضی‌شونده و عملیات idempotent        |
| `/verification`، `/cards`، `/referrals`، `/support` | KYC، کارت، دعوت و ticket پشتیبانی                            |
| `/settings`                                         | پروفایل، avatar، preference، رمز، session و TOTP             |
| `/admin/*`                                          | overview، کاربر، احراز، پشتیبانی و تنظیمات مبتنی بر مجوز     |

به‌جز login و register همهٔ routeها محافظت‌شده‌اند و route ناشناخته به dashboard می‌رود.

## پوسته و احراز هویت

پوسته sidebar دسکتاپ، drawer جهت‌دار موبایل، اعلان سروری، theme/language switcher و منوی حساب دارد. access token فقط در حافظه است؛ refresh cookie ارسال می‌شود و refreshهای هم‌زمان ادغام می‌شوند. route و navigation از permission صریح استفاده می‌کنند و API باید مستقل `403` بدهد. ورود MFA کد authenticator یا recovery کامل می‌خواهد و پیام‌ها وجود ایمیل خاص را افشا نمی‌کنند.

## بازار، معامله و سفارش

بازار 25 ردیف در هر صفحه، جست‌وجوی deferred، علاقه‌مندی محلی و WebSocket با backoff دارد. ticker، candle، depth و trade از دادهٔ عمومی Binance نرمال و در runtime معتبر می‌شوند. قیمت اجرای سفارش و fee را سرور تعیین می‌کند؛ سفارش limit موجودی را reserve و لغو همان reservation را آزاد می‌کند. creation از idempotency key رمزنگارانه استفاده می‌کند.

## کیف پول، خرید و تبدیل

کیف پول جست‌وجو، پنهان‌سازی موجودی و واریز/برداشت معتبر دارد. خرید USD از 10 تا 50,000 برای BTC/ETH/USDT quote کوتاه‌عمر، countdown و polling دارد. تبدیل BTC/ETH/USDT/SOL مقدار تا هشت رقم اعشار را می‌پذیرد و فقط quote ID و idempotency key را اجرا می‌کند. موجودی یا ledger هیچ‌گاه optimistic تغییر نمی‌کند.

## سرویس‌های کاربر و مدیریت

احراز هویت فایل PDF/JPEG/PNG تا 5MB، کارت checksum ایرانی و نمایش ماسک‌شده، referrals با share fallback، support با conversation و lifecycle محلی‌شده و settings با پروفایل، preference، password، session و TOTP را پوشش می‌دهد. مدیریت workspaceهای تو‌در‌تو، permission مخصوص action و invalidation محدود cache دارد.

## رفتار مشترک

localeها feature-based هستند؛ preference حساب زبان/theme/notification را همگام می‌کند. runtime config بدون cache خوانده می‌شود. فقط GET بازار در PWA cache می‌شود و pageها lazy هستند.

## شکاف‌های تولید

با وجود persistence مبتنی بر Prisma/PostgreSQL در بک‌اند مرجع، email change تأییدشده، worker اعلان realtime، دفترکل دوطرفه، پرداخت، custody، matching خارجی، provider/reviewer واقعی KYC، رمزنگاری envelope، WebAuthn، مدیریت چهارچشمی، audit sink مستقل، پشتیبانی عملیاتی، tokenization کارت و کنترل fraud دعوت آمادهٔ تولید اعلام نمی‌شوند.
