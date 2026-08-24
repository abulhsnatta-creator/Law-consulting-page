async function addNewEmployee() {
    // 1. جلب البيانات من النموذج
    const name = document.getElementById('employee-name').value;
    const email = document.getElementById('employee-email').value;
    const password = document.getElementById('employee-password').value;

    // 2. التحقق من صحة البيانات
    if (!name || !email || !password) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }

    // 3. جلب توكن المستخدم الحالي (المدير)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
        alert('يرجى تسجيل الدخول أولاً');
        return;
    }

    // 4. إرسال البيانات إلى الدالة
    try {
        const response = await fetch('https://wacvbnebicbutyzpnkez.supabase.co/functions/v1/add-employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
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
            // إعادة تحميل قائمة الموظفين (اختياري)
            location.reload();
        } else {
            alert('❌ حدث خطأ: ' + (result.error || 'يرجى المحاولة مرة أخرى'));
            console.error('خطأ من الدالة:', result);
        }
    } catch (error) {
        alert('❌ حدث خطأ في الاتصال بالخادم');
        console.error('خطأ في الاتصال:', error);
    }
}
