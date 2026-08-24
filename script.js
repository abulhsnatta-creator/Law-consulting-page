async function addNewEmployee() {
    // 1. جلب البيانات من النموذج
    const name = document.getElementById('employee-name').value;
    const email = document.getElementById('employee-email').value;
    const password = document.getElementById('employee-password').value;

    if (!name || !email || !password) {
        alert('يرجى ملء جميع الحقول المطلوبة (الاسم، البريد، كلمة المرور)');
        return;
    }

    // 2. جلب الجلسة الحالية مع التحقق من صحتها بشكل صارم
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.error('خطأ في جلب الجلسة:', sessionError);
        alert('حدث خطأ في التحقق من الجلسة. يرجى تسجيل الخروج والدخول مرة أخرى.');
        return;
    }

    if (!session) {
        alert('لم يتم العثور على جلسة نشطة. يرجى تسجيل الدخول مرة أخرى.');
        // توجيه المستخدم إلى صفحة تسجيل الدخول (اختياري)
        // window.location.href = 'login.html';
        return;
    }

    // **الجزء الأهم**: التأكد من أن التوكن موجود وهو عبارة عن نص (String) وليس undefined
    const accessToken = session.access_token;
    if (!accessToken || typeof accessToken !== 'string' || accessToken.trim() === '') {
        alert('رمز الدخول غير صالح. يرجى تسجيل الخروج والدخول مرة أخرى.');
        console.error('التوكن غير صالح:', accessToken);
        return;
    }

    // 3. تجهيز الزر لحالة التحميل
    const button = document.getElementById('add-employee-btn');
    const originalText = button.innerText;
    button.innerText = 'جاري الإضافة...';
    button.disabled = true;

    try {
        // 4. إرسال البيانات إلى الدالة
        const response = await fetch('https://wacvbnebicbutyzpnkez.supabase.co/functions/v1/add-employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // تأكد من أن التوكن يُرسل كـ Bearer token بشكل صحيح
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                role: 'employee',
                status: 'active'
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert('✅ تم إضافة الموظف بنجاح!');
            // (اختياري) إعادة تحميل الصفحة لرؤية التحديث
            location.reload();
        } else {
            // عرض رسالة الخطأ القادمة من الدالة
            alert('❌ فشلت الإضافة: ' + (result.error || 'خطأ غير معروف'));
            console.error('تفاصيل الخطأ من الدالة:', result);
        }
    } catch (error) {
        alert('❌ حدث خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت.');
        console.error('خطأ الشبكة:', error);
    } finally {
        // إعادة الزر إلى وضعه الطبيعي
        button.innerText = originalText;
        button.disabled = false;
    }
}
