<!-- source: API.md; source-sha256: 1177856a9bd90d8fc2d94b284e38a2bbbca4c82ccb5b73d508aa9b34e288ef1c -->

# قرارداد API

[English](API.md) | [فارسی](API.fa.md)

این سند معنای فارسی قرارداد لازم میان فرانت‌اند و Nexora API است. نام fieldها، routeها، enumها و codeهای خطا بخشی از قرارداد فنی‌اند و ترجمه نمی‌شوند.

## قراردادهای عمومی

JSON با `Content-Type: application/json` مبادله می‌شود؛ زمان‌ها ISO 8601 UTC، مبلغ‌ها decimal string و شناسه‌ها opaque هستند. endpointهای محافظت‌شده bearer access token و refresh cookie می‌خواهند. mutationهای مالی `Idempotency-Key` رمزنگارانه دارند. خطا باید code عمومی پایدار، status مناسب و در صورت نیاز field errors بدهد؛ متن داخلی server مستقیماً نمایش داده نمی‌شود.

## احراز هویت

قرارداد شامل ثبت‌نام، login، refresh، logout، درخواست reset، current user و challenge مربوط به TOTP/recovery است. login/refresh/current-user نقش و permissionهای display-safe را برمی‌گردانند. refresh rotation باید single-use و cookie امن باشد. پاسخ‌های بازیابی نباید وجود حساب را افشا کنند و rate limit باید با `429` مشخص شود.

## مجوز و امنیت حساب

سرور برای هر route محافظت‌شده identity را resolve و permission مخصوص action را اعمال می‌کند. profile، avatar، preference، password، session listing/revocation و TOTP setup/confirm/disable متعلق به حساب جاری‌اند. upload avatar فقط PNG/JPEG/WebP تا 1MB است؛ recovery code فقط یک‌بار نمایش و مصرف می‌شود.

## endpointهای محصول

قرارداد resourceهای dashboard، markets، ticker، candles، depth، recent trades، wallet assets/transactions، deposit/withdraw، orders، notifications، verification، cards، referrals، support و administration را پوشش می‌دهد. listها pagination مشخص دارند و پاسخ‌های حساس در مرز شبکه runtime-validate می‌شوند.

### بازار و WebSocket

shapeهای بازار provider-neutral هستند. subscription باید symbol معتبر داشته باشد و eventهای ticker دارای symbol، price، change، volume و timestamp هستند. client event stale یا متعلق به symbol دیگر را رد می‌کند. disconnect و upstream failure باید صریح باشند و با قیمت مصنوعی پنهان نشوند.

### سفارش

سفارش buy/sell و market/limit دارد. server precision، balance، reference price، fee و وضعیت را تعیین می‌کند. market و limit قابل اجرا اتمیک تسویه می‌شوند؛ limit resting موجودی base/quote را reserve و cancellation همان reservation را آزاد می‌کند. creation idempotent است و history/open order قابل فیلترند.

## خرید سریع

quote با amount دلاری `10.00` تا `50000.00` و asset یکی از BTC/ETH/USDT ساخته می‌شود و quote ID، unit price، fee، total، received amount و expiry می‌دهد. execute فقط quote ID و idempotency key را می‌پذیرد. وضعیت pending با polling دنبال و terminal state باعث refresh cache می‌شود.

## تبدیل دارایی

BTC، ETH، USDT و SOL پشتیبانی می‌شوند. amount مثبت تا هشت رقم اعشار است و source/destination متفاوت‌اند. quote rate، fee در واحد source، destination amount و expiry می‌دهد. execute فقط quote opaque را مصرف می‌کند. سرور ownership، expiry و balance را بررسی و هر دو سمت تبدیل را در transaction واحد ثبت می‌کند.

## پشتیبانی، احراز، کارت و دعوت

ticketها create/list/detail/reply/close با category و lifecycle ثابت دارند. KYC draft، upload تا 5MB و submit یک‌باره دارد و identifier حساس ماسک می‌شود. کارت با checksum کارت و IBAN، fingerprint کاربرمحور، مقدار ماسک‌شده، default selection و delete تأییدشده کار می‌کند. referral summary، metrics و activity می‌دهد و attribution/settlement واقعی یک integration تولیدی است.

## مدیریت

overview، user search/detail/action، verification queue/review، support reply و platform settings هرکدام permission مستقل، validation، audit و pagination دارند. هیچ permission یا role ارسال‌شده از browser قابل اعتماد نیست.

## پیامدهای cache

هر mutation فقط query keyهای مرتبط را invalidate یا reconcile می‌کند. عملیات برگشت‌پذیر می‌تواند optimistic باشد؛ balance، ledger، purchase، conversion و withdrawal فقط پس از پاسخ قطعی server تغییر می‌کنند.

## تکامل قرارداد

تغییر ناسازگار به versioning و rollout هماهنگ نیاز دارد. field جدید باید additive باشد؛ enum یا error code جدید باید پیش از استفاده در هر دو locale و parserهای runtime اضافه شود. frontend و backend باید contract test مشترک داشته باشند.
