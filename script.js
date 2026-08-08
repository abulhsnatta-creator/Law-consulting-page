document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // إعدادات Supabase
    // =========================================================

    const SUPABASE_URL = 'https://wacvbnebicebutyzpnkez.supabase.co';

    const SUPABASE_ANON_KEY =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhY3ZibmViaWNidXR5enBua2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxODYzMjEsImV4cCI6MjEwMTc2MjMyMX0.NEjwCs4ZBcoJT9ZVxNnYaZRY1-DIUjk-aNqV3rs5A4w';

    const SUPABASE_TABLE = 'consultation_requests';


    // =========================================================
    // 1. تهيئة مكتبة AOS
    // =========================================================

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }


    // =========================================================
    // 2. قائمة الموبايل
    // =========================================================

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {

        menuToggle.addEventListener('click', () => {

            navLinks.style.display =
                navLinks.style.display === 'flex' ? 'none' : 'flex';

            if (navLinks.style.display === 'flex') {

                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.right = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#fff';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow =
                    '0 5px 10px rgba(0,0,0,0.1)';
            }
        });
    }


    // =========================================================
    // 3. الأسئلة الشائعة Accordion
    // =========================================================

    const accordionHeaders =
        document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {

        header.addEventListener('click', () => {

            const content = header.nextElementSibling;
            const icon = header.querySelector('i');

            document
                .querySelectorAll('.accordion-content')
                .forEach(item => {

                    if (item !== content) {

                        item.style.display = 'none';

                        const itemIcon =
                            item.previousElementSibling?.querySelector('i');

                        if (itemIcon) {
                            itemIcon.className =
                                'fas fa-chevron-down';
                        }
                    }
                });

            if (content.style.display === 'block') {

                content.style.display = 'none';

                if (icon) {
                    icon.className =
                        'fas fa-chevron-down';
                }

            } else {

                content.style.display = 'block';

                if (icon) {
                    icon.className =
                        'fas fa-chevron-up';
                }
            }
        });
    });


    // =========================================================
    // 4. العداد التصاعدي
    // =========================================================

    const counters = document.querySelectorAll('.counter');

    let animated = false;

    const startCounters = () => {

        counters.forEach(counter => {

            const target =
                +counter.getAttribute('data-target');

            const speed = 200;

            const updateCount = () => {

                const count =
                    +counter.innerText;

                const inc =
                    target / speed;

                if (count < target) {

                    counter.innerText =
                        Math.ceil(count + inc);

                    setTimeout(updateCount, 20);

                } else {

                    counter.innerText = target;
                }
            };

            updateCount();
        });
    };


    // =========================================================
    // تشغيل العداد + زر العودة للأعلى
    // =========================================================

    window.addEventListener('scroll', () => {

        const statsSection =
            document.querySelector('.stats');

        if (statsSection) {

            const sectionPos =
                statsSection.getBoundingClientRect().top;

            const screenPos =
                window.innerHeight;

            if (sectionPos < screenPos && !animated) {

                startCounters();

                animated = true;
            }
        }


        const backToTopBtn =
            document.getElementById('backToTop');

        if (backToTopBtn) {

            if (window.scrollY > 300) {

                backToTopBtn.style.display = 'block';

            } else {

                backToTopBtn.style.display = 'none';
            }
        }
    });


    // =========================================================
    // زر العودة للأعلى
    // =========================================================

    document
        .getElementById('backToTop')
        ?.addEventListener('click', () => {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        });


    // =========================================================
    // 5. إرسال نموذج الاستشارة إلى Supabase
    // =========================================================

    const leadForm =
        document.getElementById('leadForm');

    const formResponse =
        document.getElementById('formResponse');


    if (leadForm) {

        leadForm.addEventListener('submit', async (e) => {

            e.preventDefault();


            // -------------------------------------------------
            // قراءة البيانات من النموذج
            // -------------------------------------------------

            const fullName =
                document.getElementById('name')?.value.trim();

            const phone =
                document.getElementById('phone')?.value.trim();

            const email =
                document.getElementById('email')?.value.trim();

            const company =
                document.getElementById('company')?.value.trim();

            const service =
                document.getElementById('service-type')?.value;

            const message =
                document.getElementById('message')?.value.trim();

            const privacyAccepted =
                document.getElementById('privacy')?.checked;


            // -------------------------------------------------
            // التحقق من الموافقة
            // -------------------------------------------------

            if (!privacyAccepted) {

                formResponse.style.color = '#dc2626';

                formResponse.innerText =
                    'يجب الموافقة على سياسة الخصوصية قبل إرسال الطلب.';

                return;
            }


            // -------------------------------------------------
            // تغيير حالة الزر أثناء الإرسال
            // -------------------------------------------------

            const submitButton =
                leadForm.querySelector('button[type="submit"]');

            const originalButtonText =
                submitButton ? submitButton.innerText : '';

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerText =
                    'جاري إرسال الطلب...';
            }


            formResponse.style.color = '#666';

            formResponse.innerText =
                'جاري إرسال طلب الاستشارة...';


            try {

                // -------------------------------------------------
                // إرسال البيانات إلى Supabase
                // -------------------------------------------------

                const response = await fetch(
                    `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json',

                            'apikey': SUPABASE_ANON_KEY,

                            'Authorization':
                                `Bearer ${SUPABASE_ANON_KEY}`,

                            'Prefer': 'return=minimal'
                        },

                        body: JSON.stringify({

                            full_name: fullName,

                            phone: phone,

                            email: email,

                            company: company || null,

                            service: service,

                            message: message || null,

                            privacy_accepted: true

                        })
                    }
                );


                // -------------------------------------------------
                // التحقق من نتيجة Supabase
                // -------------------------------------------------

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        'Supabase Error:',
                        errorText
                    );

                    throw new Error(
                        'فشل في حفظ الطلب'
                    );
                }


                // -------------------------------------------------
                // نجاح الحفظ
                // -------------------------------------------------

                formResponse.style.color = '#10b981';

                formResponse.innerText =
                    'تم استلام طلبك بنجاح! سيتواصل معك مستشارنا القانوني خلال 24 ساعة.';


                // تنظيف النموذج
                leadForm.reset();


            } catch (error) {

                console.error(
                    'Form submission error:',
                    error
                );

                formResponse.style.color = '#dc2626';

                formResponse.innerText =
                    'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى أو التواصل معنا عبر الهاتف أو واتساب.';

            } finally {

                // إعادة الزر إلى حالته الطبيعية

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.innerText =
                        originalButtonText;
                }
            }

        });
    }

});
