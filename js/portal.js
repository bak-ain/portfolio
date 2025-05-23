gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin);

$(function () {
  const $body = $('body');
  const $qr = $('.portal_cards .qr');
  const $cards = $('.portal_cards .card');
  const $scrollHint = $('.scroll_hint2');
  let isDragging = false;
  let hasDragged = false;
  let isNavigatingFromGNB = false;
  let isMobilePortalInitialized = false;
  let hiddenPortalTrigger = null;


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
    $('.portal_circle, .portal_title').removeClass('on');
    $('body').removeClass('scroll-lock');
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
    $scrollHint.removeClass('blinking');
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

  function initScrollTriggers() {
    hiddenPortalTrigger = ScrollTrigger.create({
      id: 'hidden_portal_pin',
      trigger: '#hidden_portals',
      start: 'top top',
      end: '+=100%',
      pin: true,
      onEnter: () => {
        if (!isNavigatingFromGNB) $body.addClass('scroll-lock');
        hasDragged = false;
      },
      onEnterBack: () => {
        if (!isNavigatingFromGNB) {
          $body.addClass('scroll-lock');
          resetPortal(false);
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
  }


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

  $scrollHint.on('click', function (e) {
    e.preventDefault();
    const offset = $('#send_signal').offset().top;
    $('.portal_circle, .portal_title').removeClass('on');
    resetPortal(false);
    $body.removeClass('scroll-lock');
    $('html, body').animate({ scrollTop: offset }, 1600);
    $(this).fadeOut();
  });

  $('.card3').on('click', function (e) {
    e.preventDefault();
    if (isDragging) return;
    $cards.each(function () {
      const randomClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
      $(this).removeClass(colorClasses.join(' ')).addClass(randomClass);
    });
  });

  // .card2 클릭 → 외부 링크
  let cardClickStartX = 0;
  let cardClickStartY = 0;
  let isCardDragMoving = false;
  const dragThreshold = 6;

  $('.card2').on('mousedown touchstart', function (e) {
    const point = e.type === 'touchstart' ? e.originalEvent.touches[0] : e;
    cardClickStartX = point.clientX;
    cardClickStartY = point.clientY;
    isCardDragMoving = false;
  });

  $('.card2').on('mousemove touchmove', function (e) {
    const point = e.type === 'touchmove' ? e.originalEvent.touches[0] : e;
    const dx = Math.abs(point.clientX - cardClickStartX);
    const dy = Math.abs(point.clientY - cardClickStartY);
    if (dx > dragThreshold || dy > dragThreshold) {
      isCardDragMoving = true;
    }
  });

  $('.card2').on('click', function (e) {
    if (isCardDragMoving) return;
    const href = $(this).data('href');
    const target = $(this).data('target');
    if (!href) return;
    target === '_blank' ? window.open(href, '_blank') : window.location.href = href;
  });

  $('.card10').on('click', function (e) {
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

  $('.card4').on('click', function (e) {
    e.preventDefault();
    if (isDragging) return;
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
  });

  $('.portal_cards .card').hover(() => {
    $('.portal_cards .card').addClass('shake_hover');
  });

  // GNB 클릭 시 스크롤락 제어
  $('.gnb li a').on('click', function (e) {
    e.preventDefault();
    isNavigatingFromGNB = true;

    const con = $(this).attr('href');
    const $target = $(con);
    const currentScroll = $target.offset().top + 3;

    $('html, body').animate({ scrollTop: currentScroll }, 200, () => {
      if (con === '#mission_log') {
        $('.section2 article').removeClass('show');
        const st = ScrollTrigger.getById('horizontalScroll');
        if (st) {
          const scrollToY = st.start;
          window.scrollTo({ top: scrollToY, behavior: 'auto' });
        }
      }
      if (con === '#hidden_portals') {
        $body.addClass('scroll-lock');
      }

      setTimeout(() => {
        isNavigatingFromGNB = false;
      }, 500);
    });
  });

  // 💡 모바일용 portal init
  function initMobilePortal() {
    if (isMobilePortalInitialized) return;
    isMobilePortalInitialized = true;

    if (!$qr.hasClass('card')) $qr.addClass('card');
    $cards.each((i, el) => $(el).css('order', i + 1));

    $cards.on('click', function () {
      const $qr = $('.portal_cards.mobile .card.qr');
      const $scrollHint = $('.scroll_hint2');

      if (!$qr.hasClass('shown')) {
        const randomOrder = Math.floor(Math.random() * 12) + 1;
        $qr.css({ order: randomOrder }).removeClass(colorClasses.join(' ')).addClass('shown');
        gsap.fromTo($qr, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.8 });
      }

      if (!$scrollHint.hasClass('blinking')) {
        $scrollHint.fadeIn(1000, () => {
          $scrollHint.addClass('blinking');
        });
      }
    });

    $('.portal_cards.mobile .card3').on('click', function (e) {
      e.preventDefault();
      $cards.each(function () {
        const $card = $(this);
        if (!$card.hasClass('qr')) {
          const randomClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
          $card.removeClass(colorClasses.join(' ')).addClass(randomClass);
        } else {
          $card.removeClass(colorClasses.join(' '));
        }
      });
    });

    $('.portal_cards.mobile .card10').on('click', function (e) {
      e.preventDefault();
      const indices = [...Array($cards.length).keys()];
      indices.sort(() => Math.random() - 0.5);
      $cards.each(function (i) {
        $(this).css('order', indices[i] + 1);
      });
    });

    $('.portal_cards.mobile .card4').on('click', function (e) {
      e.preventDefault();
      $cards.each(function (i) {
        $(this)
          .removeClass(colorClasses.join(' '))
          .addClass(defaultColors[i])
          .css('order', i + 1);
      });
      $qr.removeClass('shown');
    });

    $scrollHint.on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $('#send_signal').offset().top
      }, 500);
      resetPortal(false);
      $(this).fadeOut();
    });
  }


  function toggleLayoutClass() {
    const isMobile = window.innerWidth <= 1024;

    if (isMobile) {
      $('.portal_cards').addClass('mobile');
      initMobilePortal();

      // ✅ 기존 트리거 제거
      if (hiddenPortalTrigger) {
        hiddenPortalTrigger.kill();
        hiddenPortalTrigger = null;
      }

      ScrollTrigger.getAll().forEach(st => st.kill());
      ScrollTrigger.refresh();
    } else {
      $('.portal_cards').removeClass('mobile');
      isMobilePortalInitialized = false;

      // ✅ 중복 방지 후 ScrollTrigger 생성
      if (!hiddenPortalTrigger) {
        initScrollTriggers();
      }

      ScrollTrigger.refresh();
    }
  }



  toggleLayoutClass();
  $(window).on('resize', toggleLayoutClass);
  // if (window.innerWidth > 1024) {
  //   initScrollTriggers(); // 초기 PC 접속 시만 실행
  // }

});
