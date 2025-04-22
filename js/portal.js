gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin);

$(function () {
  const $body = $('body');
  const $qr = $('.portal_cards .qr');
  const $cards = $('.portal_cards .card');
  const $scrollHint = $('.scroll_hint2');
  let isDragging = false;
  let hasDragged = false;
  let isNavigatingFromGNB = false;

  const colorClasses = ['pink', 'purple', 'green', 'blue'];
  const defaultColors = ['pink', 'purple', 'green', 'blue', 'green', 'purple', 'blue', 'purple', 'blue', 'pink', 'green'];
  const positions = [
    { top: 100, left: 450 }, { top: 80, left: 920 }, { top: 150, right: 400 },
    { top: 350, left: 400 }, { top: 380, left: 680 }, { top: 380, left: 1100 },
    { top: 350, right: 300 }, { top: 550, right: 1300 }, { top: 630, right: 1000 },
    { top: 700, right: 660 }, { top: 600, right: 300 }
  ];

  function resetPortal(withScroll = true) {
    if (withScroll) {
      gsap.to(window, {
        scrollTo: { y: "#hidden_portals", offsetY: 0 },
        duration: 0.8
      });
    }
  
    $cards.each(function (i) {
      const $card = $(this);
      $card.removeClass(colorClasses.join(' ')).addClass(defaultColors[i]);
      $card.css({ top: '', left: '', right: '', transform: 'translate(0, 0)' });
      $card.attr('data-x', 0).attr('data-y', 0);
  
      const pos = positions[i];
      if (pos.left !== undefined) {
        $card.css({ top: pos.top + 'px', left: pos.left + 'px' });
      } else {
        $card.css({ top: pos.top + 'px', right: pos.right + 'px' });
      }
    });
  
    gsap.to($qr, { opacity: 0, scale: 1, y: 0 });
    $qr.removeClass('shown');
  }
  

  $('.portal_title').on('click', function (e) {
    e.preventDefault();

    gsap.to(window, {
      scrollTo: { y: "#hidden_portals", offsetY: 0 },
      duration: 0.5,
      onComplete: () => {
        $('.portal_circle, .portal_title').addClass('on');
        $cards.removeClass('no-transition');

        setTimeout(() => {
          $cards.addClass('no-transition');
          ScrollTrigger.refresh();
          $body.addClass('scroll-lock');
        }, 1700);
      }
    });
  });

  ScrollTrigger.create({
    trigger: '#hidden_portals',
    start: 'top top',
    end: '+=100%',
    pin: true,
    onEnter: () => {
      if (!isNavigatingFromGNB) {
        $body.addClass('scroll-lock');
      }
      hasDragged = false;
    },
    onEnterBack: () => {
      if (!isNavigatingFromGNB) {
        $body.addClass('scroll-lock');
        resetPortal();
      }
      hasDragged = false;
    },
    onLeave: () => {
      $body.removeClass('scroll-lock');
    },
    onLeaveBack: () => {
      $body.removeClass('scroll-lock');
      hasDragged = false;
    },
    preventOverlaps: true
  });

  $cards.draggable({
    containment: '.portal_circle',
    start: function () {
      isDragging = true;

      if ($qr.css('opacity') === "0" || $qr.css('opacity') === "0%") {
        gsap.fromTo($qr, {
          opacity: 0,
          scale: 0.5
        }, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        });
      }

      if (!hasDragged) {
        hasDragged = true;
        $scrollHint.fadeIn(1500, () => {
          $scrollHint.addClass('blinking');
        });
      }
    },
    stop: function () {
      setTimeout(() => {
        isDragging = false;
      }, 50);
    }
  });

  $scrollHint.on('click', function () {
    e.preventDefault();
    const offset = $('#send_signal').offset().top;
    $('.portal_circle, .portal_title').removeClass('on');
    resetPortal();
    $body.removeClass('scroll-lock');

    $('html, body').animate({
      scrollTop: offset
    }, 1600);

    $(this).fadeOut();
  });

  $('.card3').on('click', function () {
    e.preventDefault();
    if (isDragging) return;
    $cards.each(function () {
      const randomClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
      $(this).removeClass(colorClasses.join(' ')).addClass(randomClass);
    });
  });

  $('.card10').on('click', function () {
    e.preventDefault();
    if (isDragging) return;
    const portal = $('.portal_circle');
    const width = portal.width();
    const height = portal.height();
    const minGap = 180;
    const used = [];

    $cards.each(function () {
      const $card = $(this);
      let top, left, safe = false, tries = 0;

      while (!safe && tries < 100) {
        top = Math.random() * (height - $card.outerHeight());
        left = Math.random() * (width - $card.outerWidth());
        safe = used.every(p => Math.abs(p.left - left) > minGap || Math.abs(p.top - top) > minGap);
        tries++;
      }

      used.push({ top, left });
      $card.css({ right: 'auto', left: 'auto' });

      gsap.to($card, {
        top: top,
        left: left,
        duration: 1.2,
        ease: "power3.out"
      });
    });
  });

  $('.card4').on('click', function () {
    e.preventDefault();
    if (isDragging) return;
    resetPortal();
  });

  $('.portal_cards .card').hover(() => {
    $('.portal_cards .card').addClass('shake_hover');
  });

  // ✅ GNB 클릭 시 스크롤락 제어
  $('.gnb li a').on('click', function (e) {
    e.preventDefault();
    isNavigatingFromGNB = true;

    const con = $(this).attr('href');
    const $target = $(con);
    const currentScroll = $target.offset().top + 3;

    $('html, body').animate({
      scrollTop: currentScroll
    }, 200, () => {
      if (con === '#mission_log') {
        $('.section2 article').removeClass('show');
        const st = ScrollTrigger.getById('horizontalScroll');
        if (st) {
          // ✅ 이게 "x: 0"이 보이는 정확한 세로 위치임
          const scrollToY = st.start;

          window.scrollTo({
            top: scrollToY,
            behavior: 'auto'  // or 'smooth'
          });
        }
      }
      if (con === '#my_planets') {
        isTyping = false;
        isIntroPlayed = false;
        $body.addClass('scroll-lock');
      } if (con === '#hidden_portals') {
        $body.addClass('scroll-lock');
      }

      // 잠깐 후 자동 초기화
      setTimeout(() => {
        isNavigatingFromGNB = false;
      }, 1000);
    });
  });
});
