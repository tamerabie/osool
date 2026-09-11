# دليل النشر المجاني — أصول (Osool)

هذا المشروع يُنشر **مجاناً** بالكامل:
- **Vercel** لاستضافة الموقع ولوحة الإدارة (خطة Hobby المجانية).
- **Supabase** لقاعدة البيانات وتسجيل الدخول وتخزين الملفات (خطة Free).
- **GitHub** لتخزين الكود وربطه بـ Vercel.

> ملاحظة: المساعد الذكي OAA والبريد يحتاجان مفاتيح API خارجية؛ كلاهما يعمل مجاناً لحدود صغيرة، ويمكن تأجيله للمرحلة التالية.

---

## المرحلة 0 — تشغيل محلي (للتجربة على جهازك)
```powershell
cd C:\Users\Tamer\Desktop\Osool\osool-app
npm install      # إن لم يكن مكتملاً
npm run dev
```
افتح http://localhost:3000

---

## المرحلة 1 — حساب GitHub
1. اذهب إلى https://github.com → **Sign up** (بريد + كلمة مرور + اسم مستخدم).
2. أكّد البريد من الرسالة الواردة.
3. ثبّت **Git for Windows** من https://git-scm.com/download/win (التالي/Next حتى النهاية).
4. بعد التثبيت، أعد فتح PowerShell وشغّل مرة واحدة (ضع بريدك واسمك):
```powershell
git config --global user.name "اسمك"
git config --global user.email "بريدك@example.com"
```

## المرحلة 2 — رفع الكود إلى GitHub
```powershell
cd C:\Users\Tamer\Desktop\Osool\osool-app
git init
git add -A
git commit -m "first commit"
git branch -M main
```
ثم أنشئ مستودعاً فارغاً من https://github.com/new (بدون README)، وخذ اسمه واربطه:
```powershell
git remote add origin https://github.com/USERNAME/osool-app.git
git push -u origin main
```
(قد يطلب GitHub تسجيل الدخول — استخدم **Token** من
https://github.com/settings/tokens بصلاحيات `repo`، أو زر **Sign in with browser**.)

## المرحلة 3 — حساب Supabase (الخلفية)
1. اذهب إلى https://supabase.com → **Start your project** → سجّل الدخول بحساب GitHub.
2. أنشئ **New project**: اختر Organization (مجاني)، سمِّ المشروع `osool`، واختر كلمة مرور قوية لقاعدة البيانات، والمنطقة الأقرب (Germany/EU).
3. انتظر دقيقة حتى يُنشأ.
4. من القائمة: **SQL Editor** → الصق محتوى الملف `supabase/schema.sql` كاملاً → **Run**. هذا يبني الجداول وصلاحيات RLS.
5. من **Project Settings → API** انسخ:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (سري، لا يظهر في المتصفح)

## المرحلة 4 — النشر على Vercel
1. اذهب إلى https://vercel.com → **Sign Up** باختيار **Continue with GitHub**.
2. من لوحة التحكم: **Add New → Project** → اختر مستودع `osool-app` → **Import**.
3. Vercel سيتعرّف تلقائياً على Next.js. اضغط **Environment Variables** وأضف:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. اضغط **Deploy**. بعد دقيقة سيظهر رابط مجاني مثل `osool-app.vercel.app`.
5. كل `git push` لاحق يحدّث الموقع تلقائياً.

## المرحلة 5 — ربط نطاق خاص (اختياري)
- احجز نطاقاً (مثلاً `osoolgsc.com`) من Namecheap/Cloudflare.
- من Vercel: **Project → Settings → Domains → Add** واتبع تعليمات الـ DNS.

---

## المرحلة 6 — ترقية نفسك إلى مدير في التطبيق
بعد إنشاء حساب من صفحة التسجيل على موقعك:
1. في Supabase: **Table Editor → profiles**.
2. غيّر عمود `role` لحسابك إلى `admin`.
3. سجّل الخروج والدخول من جديد لتظهر لوحة الإدارة.

---

## تكاليف الخطة المجانية (حدود تقريبية)
| الخدمة | المجاني |
|---|---|
| Vercel (Hobby) | مشروع لا نهائي، 100GB انتقال/شهر |
| Supabase (Free) | قاعدة 500MB، مصادقة 50k مستخدم/شهر، تخزين 1GB |
| GitHub (Free) | مستودعات خاصة/عامة بلا حدود عملية |

## المتغيرات الإضافية والوظائف الجديدة
بعد تشغيل `supabase/schema.sql`، تُنشأ حاوية Storage باسم `transaction-files` تلقائياً. ترفع بوابة العميل المرفقات إليها قبل إنشاء المعاملة وتحفظ روابطها في عمود `files`.

أضف في Vercel المتغيرات التالية:
- `CRON_SECRET`: قيمة عشوائية طويلة يستعملها مسار التقرير اليومي.
- `ADMIN_EMAIL`: البريد الذي يستقبل التقرير اليومي.
- `OPENAI_API_KEY`: مفتاح مزود متوافق مع OpenAI لتشغيل المساعد OAA؛ قبل إضافته تظهر رسالة إرشادية بدلاً من فشل الصفحة.
- `OPENAI_ASSISTANT_MODEL`: اختياري، والافتراضي `gpt-4o-mini`.

تتضمن لوحة الإدارة الآن نماذج تسجيل الإيرادات والمصروفات، نموذج مكتبة أصول، تقويم المراجعات، والمساعد العربي. عند تسجيل دفعة مرتبطة برقم معاملة، يحدّث trigger قاعدة البيانات `paid_fees` و`remaining` تلقائياً.

### التقرير اليومي على Vercel Hobby
يمكن استدعاء `/api/daily-report` بترويسة `Authorization: Bearer <CRON_SECRET>`. خطة Vercel المجانية تدعم Cron Jobs مرة واحدة يومياً فقط؛ لذلك اضبط الجدولة اليومية في `vercel.json` أو لوحة Vercel، ولا تعتمد على تشغيل كل ساعة أو كل دقيقة في الخطة المجانية.
