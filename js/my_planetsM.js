$(function () {
    $('.typing_text1').css({ visibility: 'hidden', opacity: 0 }).html('');
    let isTyping = false;
    let typingInterval1 = null;
    let typingIntervalLoop = null;

    const $text1 = $('.section3_m .typing_text1');
    const $hint = $('.section3_m .intro .scroll_hint');
    const $ship = $('.section3_m .intro .spaceship');

    const $typingEm = $('.section3_m .em_typing em');
    const $restText = $('.section3_m .rest_text');

    const text1 = "MY PLANETS";
    const emText = "AIN UNIVERSE";

    // 루프 타이핑
    function typeLoop($el, text, speed) {
        if (typingIntervalLoop) clearInterval(typingIntervalLoop);
        let i = 0;
        function loopTyping() {
            i = 0;
            $el.text('');
            typingIntervalLoop = setInterval(() => {
                $el.text(text.slice(0, ++i));
                if (i >= text.length) {
                    clearInterval(typingIntervalLoop);
                    setTimeout(loopTyping, 1000);
                }
            }, speed);
        }
        loopTyping();
    }
    // 기본 타이핑
    function typeElement($el, fullText, speed, callback) {
        $el.html('');
        $el.css({ visibility: 'visible', opacity: 1 });
        let i = 0;
        const interval = setInterval(() => {
            $el.html(fullText.slice(0, i + 1));
            i++;
            if (i >= fullText.length) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, speed);
        return interval;
    }

    // 인트로 시작 애니메이션
    function startTypingAndFly() {
        if (isTyping) return;
        $('body').removeClass('scroll-lock');

        isTyping = true;

        $text1.html('').css({ visibility: 'hidden', opacity: 0 });
        $typingEm.text('');
        $restText.css({ opacity: 0, transform: 'translateX(-30px)' });
        $hint.hide();

        clearInterval(typingInterval1);
        clearInterval(typingIntervalLoop);

        $ship.removeClass('on');
        void $ship[0].offsetWidth; // 강제 리플로우
        $ship.addClass('on');

        typingInterval1 = typeElement($text1, text1, 100, () => {
            typeLoop($typingEm, emText, 80);

            gsap.fromTo($restText,
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1.2,
                    ease: 'power2.out',
                    delay: 1,
                    onComplete: () => {
                        isTyping = false;
                        typingDone = true;
                        // $hint.fadeIn();
                    }
                });
        });
    }

    // ✅ 섹션 진입 감지 후 실행 (ScrollTrigger 없이)
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    let hasEnteredMyPlanets = false;
    window.addEventListener('scroll', () => {
        const section = document.querySelector('.section3_m');
        if (!section) return;

        if (isInViewport(section)) {
            if (!hasEnteredMyPlanets) {
                hasEnteredMyPlanets = true;
                startTypingAndFly();
            }
        } else {
            hasEnteredMyPlanets = false;
            typingDone = false;
        }
    });

    // 👉 최초 진입 시 자동 실행
    // startTypingAndFly();


    let projectsSlide;
    function initSwiper() {
        let offset = window.innerWidth <= 768
            ? window.innerWidth * 0.08
            : window.innerWidth * 0.1;


        if (projectsSlide) {
            projectsSlide.destroy(true, true);
        }

        projectsSlide = new Swiper("#my_projects", {
            slidesPerView: 'auto',
            spaceBetween: offset,
            slidesOffsetBefore: offset,
            slidesOffsetAfter: offset,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        });
    }

    initSwiper();

    window.addEventListener('resize', () => {
        initSwiper();
    });

})