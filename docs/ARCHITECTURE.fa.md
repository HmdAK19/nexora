<!-- source: ARCHITECTURE.md; source-sha256: d8fe3931fcc2a82fd0e24ab47d0e95d431cb64f053466f022c55efa49186ffa7 -->

# معماری

[English](ARCHITECTURE.md) | [فارسی](ARCHITECTURE.fa.md)

## مرز سامانه

برنامهٔ ثبت‌شده در این مخزن یک SPA مبتنی بر React است که از مسیرهای `/api` و `/ws` با [Nexora API](https://github.com/HmdAK19/nexora-api) مستقل ارتباط دارد. بک‌اند جزو این مخزن نیست و قرارداد و مسئولیت‌های امنیتی مورد انتظار آن فقط برای بازبینی مستقل فرانت‌اند مستند شده‌اند.

## ساختار کد

`src/app` ترکیب providerها، routing، layout، theme و Redux را در اختیار دارد؛ `src/features` قابلیت‌های کسب‌وکار را با لایه‌های اختیاری `api`، `components`، `hooks`، `lib`، `locales`، `model` و `pages` نگهداری می‌کند؛ `src/shared` فقط زیرساخت و primitiveهای پایدار مشترک را شامل می‌شود. مصرف‌کنندگان باید از barrelهای `index.ts` استفاده کنند.

## قواعد وابستگی

1. `shared` از feature یا app import نمی‌کند.
2. featureها می‌توانند `shared` و API عمومی feature دیگر را مصرف کنند.
3. `app` مسئول composition است، نه قواعد کسب‌وکار.
4. درخواست شبکه داخل JSX قرار نمی‌گیرد.
5. مرجع نهایی عملیات مالی همیشه سرور است.

## ترتیب providerها

`main.tsx` ابتدا `runtime-config.json` را بدون cache دریافت و اعتبارسنجی می‌کند و سپس `bootstrap.tsx` را بارگذاری می‌کند. خطا به‌صورت بسته و دو‌زبانه نمایش داده می‌شود. ترتیب providerها عبارت است از i18next، زبان/جهت، Redux، Emotion/MUI، TanStack Query و احراز هویت.

## مالکیت state

| state             | مالک                               |
| ----------------- | ---------------------------------- |
| دادهٔ سرور        | TanStack Query                     |
| ترجیحات پایدار UI | Redux Persist                      |
| زبان و جهت        | language provider و local storage  |
| فرم کوتاه‌عمر     | React Hook Form یا component state |
| access token      | حافظهٔ ماژول                       |
| refresh session   | cookie از نوع HttpOnly             |

فرم‌های تغییردهندهٔ سرور از React Hook Form و schemaهای Yup متعلق به feature استفاده می‌کنند. سرور همیشه مرز نهایی اعتبارسنجی است.

## API، احراز هویت و مجوز

Axios از `apiBaseUrl` معتبر، cookie، timeout دوازده‌ثانیه‌ای و access token حافظه استفاده می‌کند. بازیابی نشست و پاسخ به 401 یک promise مشترک single-flight دارند. مجوزها capability-based و deny-by-default هستند؛ کنترل‌های کلاینت فقط UX را بهبود می‌دهند و API باید مجوز هر درخواست را مستقل اعمال کند.

بخش مدیریت یک feature تنبل با routeهای تو‌در‌تو برای overview، کاربران، احراز، پشتیبانی و تنظیمات است. هر منبع adapter، اعتبارسنجی runtime، query key و hook مستقل دارد. بک‌اند باید احراز، مجوز مخصوص action، persistence تراکنشی و audit پایدار را اعمال کند.

## قواعد تغییر cache

- optimistic update فقط برای عملیات برگشت‌پذیر مانند لغو سفارش باز مجاز است.
- از helperهای مشترک snapshot، rollback و invalidation استفاده شود.
- موجودی، ledger، خرید و برداشت خوش‌بینانه تغییر نمی‌کنند.
- پس از تأیید سرور، محدودترین query keyها invalid شوند.

## routing، کارایی و offline

صفحه‌ها با `React.lazy` بارگذاری می‌شوند و `ProtectedRoute` منتظر بازیابی نشست می‌ماند. بازارها virtualized، جست‌وجو deferred و اتصال WebSocket دارای backoff محدود است. PWA فقط GET بازار را network-first cache می‌کند؛ احراز هویت و mutationها cache نمی‌شوند.

## خطا و بارگذاری

skeletonها باید با شکل layout مقصد هماهنگ باشند. فرم‌ها ورودی قابل بازیابی را حفظ و ارسال تکراری را مسدود می‌کنند. خطاهای مالی فقط از codeهای مجاز به متن قابل نمایش تبدیل می‌شوند.

## الزامات بک‌اند

بک‌اند واقعی باید persistence پایدار و transaction-safe داشته باشد. خرید و تبدیل باید quote را اتمیک مصرف، ledger متوازن ثبت و پاسخ idempotent را ذخیره کنند. سفارش، کیف پول، احراز و مدیریت به ownership check، state transition قابل audit و ذخیره‌سازی concurrency-safe نیاز دارند.
