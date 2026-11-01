<!-- source: DESIGN_SYSTEM.md; source-sha256: 9ee602594da2a1328afee0353a7e4f2a60b1b51cc37128b40d04a71e62c09fad -->

# سیستم طراحی

[English](DESIGN_SYSTEM.md) | [فارسی](DESIGN_SYSTEM.fa.md)

نکسورا برای ثبات بصری از tokenهای Material UI و componentهای متعلق به feature استفاده می‌کند. رنگ برند یا primitive تکراری نباید داخل صفحه تعریف شود.

## مبانی

رنگ‌های اصلی عبارت‌اند از پس‌زمینهٔ تیره `#0b0e14`/روشن `#f5f7fb`، سطح `#141821`/`#ffffff`، آبی اصلی `#1769ff`، cyan ثانویه `#20d6c7`، موفق `#28d7a2`، خطا `#ff4d78` و هشدار `#ffad32`. فاصله‌ها بر پایهٔ 8px، radius عمومی 14px و فونت‌ها Inter، Vazirmatn و fallbackهای سیستم هستند.

نشان نکسورا یک `N` پیوسته برای بازارهای متصل و جریان مبادله است؛ گرهٔ cyan کاربر را در مرکز شبکه نمایش می‌دهد.

## چیدمان

- کمترین عرض پشتیبانی‌شده 320px است.
- sidebar دسکتاپ در زیر `md` به drawer هماهنگ با جهت تبدیل می‌شود.
- padding و gridها در breakpointهای کوچک کاهش می‌یابند.
- محیط معامله در عرض زیاد از grid areaهای order book، chart/order entry و market/recent trades استفاده می‌کند و در عرض کم بدون حذف قابلیت stack می‌شود.
- فهرست‌ها فضای باقی‌مانده را مصرف و overflow را داخل خود scroll می‌کنند.
- tabها می‌توانند افقی scroll شوند و شناسه‌ها و اعداد مالی wrap کنترل‌شده دارند.
- فضای مدیریت navigation مبتنی بر مجوز و جدول responsive دارد.

## مالکیت component

primitiveهای عمومی مانند `PageHeading`، `PageFeedback`، `SkeletonState`، `StatCard`، `AssetAvatar`، `Sparkline` و `BrandLogo` در `shared/ui` هستند. component دامنه‌ای در feature می‌ماند و فقط پس از نیاز دو feature نامرتبط به shared منتقل می‌شود.

## حالت‌های تعامل

هر تعامل داده‌محور باید loading، empty، error، success، disabled و retry داشته باشد. فرم مالی ارسال تکراری را متوقف، انقضای quote را نمایش و شناسهٔ retry امن را حفظ می‌کند. منوی حساب keyboard navigation، بازگشت focus و Escape را حفظ می‌کند. skeletonها با layout مقصد هم‌شکل‌اند و رنگ تنها نشانهٔ موفقیت یا خطا نیست.

## زبان و جهت

- متن کاربر در JSONهای locale قرار می‌گیرد، نه شرط `fa` در JSX.
- انگلیسی LTR و فارسی RTL است.
- انتخاب زبان محلی ذخیره می‌شود و preference حساب پس از همگام‌سازی مرجع است.
- Emotion cache مخصوص جهت، MUI را تبدیل می‌کند و styleهای پروژه از propertyهای logical استفاده می‌کنند.
- namespace جدید باید در `namespaces.ts` و config هر دو زبان ثبت شود.

## دسترس‌پذیری و حرکت

از form، button، heading و landmark معنایی، label متصل، `aria-live` برای نتیجهٔ async، focus قابل مشاهده و کنتراست WCAG AA استفاده شود. animationها محدود و سازگار با `prefers-reduced-motion` هستند و اطلاعات عملکردی بدون حرکت نیز در دسترس می‌مانند.
