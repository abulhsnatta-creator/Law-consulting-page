document.addEventListener('DOMContentLoaded', () => {
    
    // 1. تهيئة مكتبة الأنيميشين AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // 2. قائمة الموبايل (Mobile Menu)
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.right = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#fff';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
            }
        });
    }

    // 3. الأسئلة الشائعة (Accordion Toggle)
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('i');

            // إغلاق باقي العناصر
            document.querySelectorAll('.accordion-content').forEach(item => {
                if (item !== content) {
                    item.style.display = 'none';
                    if (item.previousElementSibling.querySelector('i')) {
                        item.previousElementSibling.querySelector('i').className = 'fas fa-chevron-down';
                    }
                }
            });

            // تبديل حالة العنصر الحالي
            if (content.style.display === 'block') {
                content.style.display = 'none';
                icon.className = 'fas fa-chevron-down';
            } else {
                content.style.display = 'block';
                icon.className = 'fas fa-chevron-up';
            }
        });
    });

    // 4. العداد التصاعدي للأرقام (Counter Animation)
    const counters = document.querySelectorAll('.counter');
    let animated = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const speed = 200;
            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // تشغيل العداد عند الوصول للقسم
    window.addEventListener('scroll', () => {
        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            const sectionPos = statsSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight;
            if (sectionPos < screenPos && !animated) {
                startCounters();
                animated = true;
            }
        }

        // 5. زر العودة للأعلى (Back to Top)
        const backToTopBtn = document.getElementById('backToTop');
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    document.getElementById('backToTop')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 6. التعامل مع إرسال النموذج (Form Submission)
    const leadForm = document.getElementById('leadForm');
    const formResponse = document.getElementById('formResponse');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // رسالة النجاح المبسطة
            formResponse.style.color = '#10b981';
            formResponse.innerText = 'تم استلام طلبك بنجاح! سيتواصل معك مستشارنا القانوني خلال 24 ساعة.';
            
            leadForm.reset();
        });
    }
});