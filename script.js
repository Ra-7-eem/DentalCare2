document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat-number');

    // Function to animate a single counter
    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        // duration in ms
        const duration = 2500;
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);

        let frame = 0;
        // Ease-out function for smooth deceleration
        const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

        const counter = setInterval(() => {
            frame++;
            const progress = easeOutExpo(frame / totalFrames);
            const currentCount = Math.round(target * progress);

            // Format number with commas
            const formattedNumber = currentCount.toLocaleString('en-US');

            // Combine with prefix and suffix
            el.innerText = `${prefix}${formattedNumber}${suffix}`;

            if (frame >= totalFrames) {
                clearInterval(counter);
                // Ensure exact final number
                el.innerText = `${prefix}${target.toLocaleString('en-US')}${suffix}`;
            }
        }, frameDuration);
    };

    // Intersection Observer to trigger animation when scrolled into view
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% visible
    });

    stats.forEach(stat => observer.observe(stat));

    // Initialize Swiper for Testimonials Section
    const testimSwiperEl = document.querySelector('.testimonials-swiper');
    if (testimSwiperEl) {
        const testimonialsSwiper = new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.swiper-button-next.custom-testim-nav',
                prevEl: '.swiper-button-prev.custom-testim-nav',
            },
            pagination: {
                el: '.swiper-pagination.testimonials-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }

    // Initialize Swiper for Services Section
    const servicesSwiperEl = document.querySelector('.services-swiper');
    if (servicesSwiperEl) {
        const servicesSwiper = new Swiper('.services-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.services-nav-next',
                prevEl: '.services-nav-prev',
            },
            pagination: {
                el: '.services-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 20
                }
            }
        });
    }

    // Initialize Swiper for Cosmetic Services
    const cosmeticSwiperEl = document.querySelector('.cosmetic-swiper');
    if (cosmeticSwiperEl) {
        const cosmeticSwiper = new Swiper('.cosmetic-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            navigation: {
                nextEl: '.cosmetic-nav-next',
                prevEl: '.cosmetic-nav-prev',
            },
            pagination: {
                el: '.cosmetic-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                1024: {
                    slidesPerView: 4,
                    spaceBetween: 20
                }
            }
        });
    }

    // Services Tabs Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Native Mobile Gallery Navigation
    const galleryScroll = document.getElementById('native-gallery-scroll');
    const galleryPrev = document.querySelector('.native-gallery-prev');
    const galleryNext = document.querySelector('.native-gallery-next');
    const galleryDotsContainer = document.querySelector('.native-gallery-dots');

    if (galleryScroll && galleryPrev && galleryNext && galleryDotsContainer) {
        const items = galleryScroll.querySelectorAll('.gallery-item');
        const itemCount = items.length;

        // Create dots
        for (let i = 0; i < itemCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('gallery-dot');
            if (i === 0) dot.classList.add('active');

            dot.addEventListener('click', () => {
                const itemWidth = items[0].offsetWidth + parseInt(window.getComputedStyle(galleryScroll).gap || 0);
                // RTL scroll: negative values for Chrome/Firefox
                galleryScroll.scrollTo({
                    left: -(itemWidth * i),
                    behavior: 'smooth'
                });
            });
            galleryDotsContainer.appendChild(dot);
        }

        const dots = galleryDotsContainer.querySelectorAll('.gallery-dot');

        // Update active dot on scroll
        galleryScroll.addEventListener('scroll', () => {
            const itemWidth = items[0].offsetWidth + parseInt(window.getComputedStyle(galleryScroll).gap || 0);
            const scrollLeft = galleryScroll.scrollLeft;
            const index = Math.round(Math.abs(scrollLeft) / itemWidth);

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        });

        // Navigation arrows
        galleryPrev.addEventListener('click', () => {
            const itemWidth = items[0].offsetWidth + parseInt(window.getComputedStyle(galleryScroll).gap || 0);
            galleryScroll.scrollBy({ left: itemWidth, behavior: 'smooth' });
        });

        galleryNext.addEventListener('click', () => {
            const itemWidth = items[0].offsetWidth + parseInt(window.getComputedStyle(galleryScroll).gap || 0);
            galleryScroll.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        });
    }

    // Gallery & Services Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    if (lightbox && lightboxImg && lightboxClose) {
        galleryItems.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });

        // Close on X click
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Generate rich background shapes dynamically for all sections
    const bgPatterns = document.querySelectorAll('.background-pattern');
    const shapesHTML = `
        <div class="floating-shape circle-1"></div>
        <div class="floating-shape circle-2"></div>
        <div class="floating-shape circle-3"></div>
        <div class="floating-shape circle-4"></div>
        <div class="floating-shape line-1"></div>
        <div class="floating-shape line-2"></div>
        <div class="floating-shape line-3"></div>
        <div class="floating-shape line-4"></div>
        <div class="floating-shape dots-1"></div>
        <div class="floating-shape dots-2"></div>
        <div class="floating-shape dots-3"></div>
        <div class="sparkle star-1"></div>
        <div class="sparkle star-2"></div>
        <div class="sparkle star-3"></div>
        <div class="sparkle star-4"></div>
        <div class="sparkle star-5"></div>
        <div class="sparkle star-6"></div>
        <div class="sparkle star-7"></div>
        <div class="sparkle star-8"></div>
        <div class="sparkle star-9"></div>
    `;
    bgPatterns.forEach(pattern => {
        pattern.innerHTML = shapesHTML;
    });

    // Parallax effect for background shapes and sparkles
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.floating-shape, .sparkle');

        shapes.forEach((shape, index) => {
            // Create a unique but consistent movement ratio for each shape
            const speed = (index % 4) + 1;
            const xOffset = (window.innerWidth / 2 - e.pageX) * (speed / 100);
            const yOffset = (window.innerHeight / 2 - e.pageY) * (speed / 100);

            // Set CSS variables that are picked up by the keyframes
            shape.style.setProperty('--mouse-x', `${xOffset}px`);
            shape.style.setProperty('--mouse-y', `${yOffset}px`);
        });
    });

    // Dynamically add 'Book Now' button to all service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        const titleElement = card.querySelector('.service-title');
        if (titleElement) {
            const btnContainer = document.createElement('div');
            btnContainer.style.marginTop = 'auto'; // push button to the bottom
            btnContainer.style.paddingTop = '1.5rem';

            const btn = document.createElement('button');
            btn.className = 'book-service-btn';
            btn.innerHTML = 'حجز موعد <i class="fas fa-calendar-check"></i>';

            btn.addEventListener('click', () => {
                let rawTitle = titleElement.textContent.trim();
                let mappedValue = rawTitle;

                // Maps for exact matches in dropdown
                if (rawTitle === 'قسم علاج العصب') mappedValue = 'علاج عصب';
                else if (rawTitle === 'تنظيف وتبييض الأسنان') mappedValue = 'تبييض الأسنان';
                else if (rawTitle === 'قسم زراعة الأسنان') mappedValue = 'زراعة اسنان';
                else if (rawTitle === 'طب أسنان الأطفال') mappedValue = 'علاج اسنان اطفال';
                else if (rawTitle === 'تجميل الأسنان') mappedValue = 'فينييرز وتلبيسات زيركون';
                else if (rawTitle === 'قسم تقويم الأسنان') mappedValue = 'تقويم اسنان (العادي)';

                const customDropdown = document.getElementById('service-dropdown');
                if (customDropdown) {
                    const optionToSelect = customDropdown.querySelector(`.dropdown-option[data-value="${mappedValue}"]`);
                    if (optionToSelect) {
                        optionToSelect.click();
                    } else {
                        // Fallback partial match
                        const allOptions = customDropdown.querySelectorAll('.dropdown-option');
                        for (let opt of allOptions) {
                            if (opt.textContent.includes(rawTitle) || rawTitle.includes(opt.textContent)) {
                                opt.click();
                                break;
                            }
                        }
                    }
                } else {
                    window.location.href = `index.html?service=${encodeURIComponent(mappedValue)}#booking`;
                    return;
                }

                const bookingSection = document.getElementById('booking');
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });

            btnContainer.appendChild(btn);
            card.appendChild(btnContainer);
        }
    });

    // Custom Dropdown Logic
    const customDropdown = document.getElementById('service-dropdown');
    if (customDropdown) {
        const selected = customDropdown.querySelector('.dropdown-selected');
        const hiddenInput = document.getElementById('service');
        const selectedText = customDropdown.querySelector('.selected-text');
        const optionItems = customDropdown.querySelectorAll('.dropdown-option');

        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            customDropdown.classList.toggle('open');
        });

        optionItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                optionItems.forEach(opt => opt.classList.remove('selected'));
                item.classList.add('selected');
                selectedText.textContent = item.textContent;
                selectedText.style.color = 'var(--text-light)';
                hiddenInput.value = item.getAttribute('data-value');
                customDropdown.classList.remove('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!customDropdown.contains(e.target)) {
                customDropdown.classList.remove('open');
            }
        });

        // Auto-select service from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        if (serviceParam) {
            setTimeout(() => {
                const optionToSelect = customDropdown.querySelector(`.dropdown-option[data-value="${serviceParam}"]`);
                if (optionToSelect) {
                    optionToSelect.click();
                } else {
                    // Fallback partial match
                    const allOptions = customDropdown.querySelectorAll('.dropdown-option');
                    for (let opt of allOptions) {
                        if (opt.textContent.includes(serviceParam) || serviceParam.includes(opt.textContent)) {
                            opt.click();
                            break;
                        }
                    }
                }

                // Scroll to booking section smoothly after a slight delay to ensure UI updates
                if (window.location.hash === '#booking') {
                    const bookingSection = document.getElementById('booking');
                    if (bookingSection) {
                        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }, 300);
        }
    }

    // Form Submission to WhatsApp
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const visitTypeElement = document.querySelector('input[name="visit_type"]:checked');
            const visitType = visitTypeElement ? (visitTypeElement.value === 'old' ? 'مريض قديم' : 'زيارة أولى') : '';
            const service = document.getElementById('service').value;
            const allergy = document.getElementById('allergy').checked ? 'نعم' : 'لا';
            const notes = document.getElementById('notes').value;

            let message = `*طلب حجز موعد جديد*\n\n`;
            message += `*الاسم:* ${name}\n`;
            message += `*رقم الهاتف:* ${phone}\n`;
            message += `*نوع الزيارة:* ${visitType}\n`;
            message += `*الخدمة المطلوبة:* ${service}\n`;
            message += `*حساسية للأدوية:* ${allergy}\n`;
            if (notes) {
                message += `*ملاحظات:* ${notes}\n`;
            }

            // يرجى استبدال هذا الرقم برقم الواتساب الخاص بالعيادة مع رمز الدولة (مثال: 966500000000)
            const whatsappNumber = "972569208261";
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
        });
    }
});

// Service Modal Functions
function openServiceModal(btn) {
    const dataDiv = btn.nextElementSibling;
    if (!dataDiv || !dataDiv.classList.contains('service-modal-data')) return;

    const title = dataDiv.querySelector('.data-title') ? dataDiv.querySelector('.data-title').innerHTML : '';
    const price = dataDiv.querySelector('.data-price') ? dataDiv.querySelector('.data-price').innerHTML : '';
    const details = dataDiv.querySelector('.data-details') ? dataDiv.querySelector('.data-details').innerHTML : '';

    let modal = document.getElementById('service-modal');
    if (!modal) {
        // Create modal
        modal = document.createElement('div');
        modal.id = 'service-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()" aria-label="Close modal"><i class="fas fa-times"></i></button>
                <h3 class="modal-title" id="modal-title"></h3>
                <div class="modal-price" id="modal-price"></div>
                <div class="modal-details" id="modal-details"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close on outside click
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.getElementById('modal-title').innerHTML = title;

    const priceEl = document.getElementById('modal-price');
    if (price) {
        priceEl.innerHTML = price;
        priceEl.style.display = 'inline-block';
    } else {
        priceEl.style.display = 'none';
    }

    const detailsEl = document.getElementById('modal-details');
    if (details) {
        detailsEl.innerHTML = details;
        detailsEl.style.display = 'block';
    } else {
        detailsEl.style.display = 'none';
    }

    // Small delay to allow CSS transition
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
    const modal = document.getElementById('service-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 300);
    }
}

// Image Lightbox Functions
document.addEventListener('DOMContentLoaded', () => {
    // Create lightbox HTML
    const lightboxHTML = `
        <div id="image-lightbox" class="lightbox-overlay">
            <div class="lightbox-content">
                <button class="lightbox-close" id="lightbox-close" aria-label="Close image"><i class="fas fa-times"></i></button>
                <img src="" alt="Enlarged service image" class="lightbox-image" id="lightbox-img">
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    // Add click event to all service images
    const serviceImages = document.querySelectorAll('.service-image');
    serviceImages.forEach(img => {
        img.addEventListener('click', (e) => {
            // Prevent event from bubbling if it's inside a clickable card
            e.stopPropagation();
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || 'Service Image';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightboxImg.src = '';
            document.body.style.overflow = '';
        }, 400); // Wait for transition
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
