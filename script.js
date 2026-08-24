/**
 * دالة متكاملة لمعالجة إضافة موظف جديد 
 * تقوم بجلب الجلسة، ضبط الـ Headers، وإرسال كلمة المرور الافتراضية '00000' تلقائياً.
 */
async function handleAddEmployeeSystem(event) {
    // منع السلوك الافتراضي للنموذج إن وجد
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }

    try {
        // 1. جلب جلسة المستخدم الحالي والتحقق من صلاحيتها والتوكن
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session || !session.access_token) {
            console.error("خطأ في الجلسة:", sessionError);
            alert("انتهت صلاحية الجلسة الحالية. يرجى تسجيل الدخول مرة أخرى.");
            return;
        }

        // 2. التقاط العناصر من واجهة المستخدم (تأكد من مطابقة الـ IDs مع الكود لديك)
        const emailInput = document.getElementById('employee-email');
        const nameInput = document.getElementById('employee-name');
        const roleInput = document.getElementById('employee-role');

        const email = emailInput ? emailInput.value.trim() : '';
        const name = nameInput ? nameInput.value.trim() : '';
        const role = roleInput ? roleInput.value : '';

        // التحقق من تعبئة البيانات الإجبارية الأساسية
        if (!email || !name) {
            alert("يرجى إدخال اسم الموظف والبريد الإلكتروني بدقة.");
            return;
        }

        // 3. تجهيز هيكل البيانات المرسلة (Payload) متضمنة كلمة المرور الافتراضية حصرياً
        const requestPayload = {
            email: email,
            name: name,
            role: role,
            password: '00000' // كلمة المرور الافتراضية المؤقتة لتفادي خطأ القيمة الفارغة في الجدول
        };

        // 4. بناء كائن الـ Headers بشكل سليم ونظيف 100% لتجنب خطأ الـ ByteString
        const requestHeaders = new Headers();
        requestHeaders.append("Content-Type", "application/json");
        // تأكد من وجود مفتاح الـ Anon الخاص بك أو استبدله بالقيمة النصية الصحيحة للمفتاح
        requestHeaders.append("apikey", typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : ''); 
        requestHeaders.append("Authorization", `Bearer ${session.access_token}`);

        // 5. تنفيذ طلب الـ Fetch إلى الـ Endpoint (استبدل الرابط أدناه برابط الـ API الفعلي لديك)
        const apiEndpoint = 'https://[ضع_رابط_المشروع_هنا].supabase.co/functions/v1/staff-management'; 

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(requestPayload)
        });

        // 6. فحص حالة الاستجابة ومعالجة الأخطاء القادمة من السيرفر
        if (!response.ok) {
            let errorMessage = `فشل الطلب برمز الحالة: ${response.status}`;
            try {
                const errorBody = await response.json();
                if (errorBody && errorBody.message) {
                    errorMessage = errorBody.message;
                }
            } catch (e) {
                // في حال لم يكن الرد بصيغة JSON
            }
            throw new Error(errorMessage);
        }

        const responseResult = await response.json();
        console.log("تمت العملية بنجاح:", responseResult);
        alert("تمت إضافة الموظف الجديد بنجاح مع تعيين كلمة المرور المؤقتة (00000).");

        // 7. إعادة تعيين الحقول وتحديث الواجهة أو الجدول تلقائياً
        const formElement = document.getElementById('add-employee-form'); // استبدل بـ ID الفورم لديك إن وجد
        if (formElement) {
            formElement.reset();
        }

        // إعادة تحميل أو تحديث قائمة الموظفين في الصفحة إن وجدت الدالة
        if (typeof loadStaffList === 'function') {
            loadStaffList();
        } else if (typeof fetchStaff === 'function') {
            fetchStaff();
        }

    } catch (err) {
        console.error("خطأ غير متوقع أثناء إضافة الموظف:", err);
        alert("حدث خطأ أثناء تنفيذ العملية: " + err.message);
    }
}

// 8. ربط الحدث تلقائياً بزر الإضافة فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // استبدل 'add-employee-btn' بالـ ID الفعلي للزر الموجود عندك في الشاشة (اللي عليه علامة + إضافة الموظف)
    const submitButton = document.getElementById('add-employee-btn'); 
    if (submitButton) {
        submitButton.addEventListener('click', handleAddEmployeeSystem);
    }
});
