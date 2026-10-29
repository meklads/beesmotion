# ربط نموذج تقييم المشاريع العقارية بـ Google Sheet

النموذج في `/propmotion/#assessment` يرسل الطلب إلى `functions/api/lead.js`، والذي يرسله بدوره إلى رابط Google Apps Script.
النتيجة: صف جديد في الشيت + إيميل تنبيه إلى `beesmotionhome@gmail.com`.

## الخطوات (مرة واحدة، من حساب beesmotionhome@gmail.com)

1. افتح Google Sheets وأنشئ ملفاً جديداً باسم **Bees Motion — Real Estate Leads**.
2. من القائمة: **Extensions ← Apps Script**.
3. احذف الكود الموجود والصق محتوى الملف `docs/lead-webhook-apps-script.gs` كاملاً، ثم احفظ.
4. من **Project Settings** (رمز الترس) ← **Script properties** ← **Add script property**:
   - Property: `LEAD_TOKEN`
   - Value: كلمة سر طويلة عشوائية (لا تشاركها ولا تضعها في GitHub).
5. **Deploy ← New deployment** ← نوع **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - اضغط Deploy ووافق على الصلاحيات (Sheets + Gmail).
6. انسخ رابط الـ Web app (ينتهي بـ `/exec`).
7. في Cloudflare: **Workers & Pages ← beesmotion ← Settings ← Variables and Secrets ← Production**:
   - أضف متغيراً من نوع **Secret** باسم `LEAD_WEBHOOK_URL`
   - القيمة: `رابط_الويب_آب?token=نفس_قيمة_LEAD_TOKEN`
8. أعد النشر (المتغيرات لا تُطبّق إلا على نشر جديد).

## الاختبار

- افتح `/propmotion/#assessment` وأرسل طلباً تجريبياً.
- يجب أن تظهر رسالة النجاح، وصف جديد في تبويب **Leads**، وإيميل في beesmotionhome@gmail.com.
- إذا ظهر زر واتساب بدلاً من رسالة النجاح: الرابط أو الـ token غير صحيح، أو لم تُعد النشر بعد الإضافة.

## ملاحظات

- عند تعديل كود Apps Script لاحقاً: **Deploy ← Manage deployments ← Edit ← New version** (حتى يبقى الرابط نفسه).
- لاحقاً يمكن إضافة الإيميل المباشر عبر Resend (`RESEND_API_KEY`, `LEAD_FROM_EMAIL`, `LEAD_TO_EMAIL`) أو استبدال الرابط بـ CRM دون تغيير الموقع.
