gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin);
$(function () {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  // let lastScrollTop = window.pageYOffset;

  // window.addEventListener('wheel', function (e) {
  //   const currentScroll = window.pageYOffset;

  //   // 휠 방향 감지
  //   if (e.deltaY < 100) {
  //     // 🔼 위로 스크롤할 때
  //     $('body').removeClass('scroll-lock');

  //   }

  //   lastScrollTop = currentScroll;
  // }, { passive: true });

  /* gnb */
 
  $(window).on("scroll", function () {
    const section2Top = $(".section2").offset().top;
    const scrollTop = $(window).scrollTop();

    if (scrollTop >= section2Top - 100) {
      $(".gnb").addClass("show");
    } else {
      $(".gnb").removeClass("show");
    }
  });


  /* custom_cursor */
  const cursor = document.querySelector('.custom_cursor');
  const myplanetsSection = document.querySelector('#my_planets');
  const signalSection = document.querySelector('#send_signal');

  $(document).on('mousemove', function (e) {
    $(cursor).css('transform', `translate(${e.clientX}px, ${e.clientY}px)`);
  });
  if (myplanetsSection && cursor) {
    myplanetsSection.addEventListener('mouseenter', () => {
      $(cursor).addClass('planets');
    })
    myplanetsSection.addEventListener('mouseleave', () => {
      $(cursor).removeClass('planets');
    })
  }
  $(document).on('mousemove', function (e) {
    $(cursor).css('transform', `translate(${e.clientX}px, ${e.clientY}px)`);
  });
  if (signalSection && cursor) {
    signalSection.addEventListener('mouseenter', () => {
      $(cursor).addClass('signal');
    })
    signalSection.addEventListener('mouseleave', () => {
      $(cursor).removeClass('signal');
    })
  };

  /* title */
// ain 등장 애니메이션
gsap.from(".ain", {
  opacity: 0,
  scale: 0.75,     // 살짝 더 탄력 있게
  y: 30,           // 약간 더 부드럽게
  duration: 1.2,
  delay: 0.5,
  ease: "power3.out"
});

// uni 등장 애니메이션
gsap.from(".uni", {
  opacity: 0,
  scale: 0.75,
  y: 30,
  duration: 1.3,
  delay: 0.8,
  ease: "power3.out"
});

// ain 부드러운 떠오름 유지
gsap.to(".ain", {
  y: 15,
  duration: 2.3,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

// uni 부드러운 무브
gsap.to(".uni", {
  y: 13,
  duration: 2.5,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});



  /* 가로스크롤 */
  /* section2 가로스크롤 */
  const horizontal = document.querySelector('.section2.horizontal');
  const cards = gsap.utils.toArray('.section2 article');
  const totalScrollLength = horizontal.scrollWidth - window.innerWidth;

  gsap.to(horizontal, {
    x: -totalScrollLength,
    ease: 'none',
    scrollTrigger: {
      id: 'horizontalScroll', // ⭐ 이 ID로 나중에 불러올 수 있음
      trigger: horizontal,
      start: 'top top',
      end: () => `+=${totalScrollLength}`,
      pin: true,
      scrub: 1.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    }
  });

  cards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: horizontal,
      start: 'top top',
      end: () => `+=${totalScrollLength}`,
      scrub: 0.5,
      onUpdate: (self) => {
        const scrollX = -gsap.getProperty(horizontal, 'x');
        const centerX = scrollX + window.innerWidth / 2;
        const cardLeft = card.offsetLeft;
        const cardRight = cardLeft + card.offsetWidth;

        const extendedRange = 200; // 카드가 사라지기 전 추가 여유 공간
        const isVisible =
          cardRight > scrollX + window.innerWidth * 0.25 - extendedRange &&
          cardLeft < scrollX + window.innerWidth * 0.75 + extendedRange;

        card.classList.toggle('show', isVisible);
      }
    });
  });

  /* 타이핑 */

  let isTyping = false;
  let isIntroPlayed = false;
  
  const $text1 = $('.typing_text1');
  const $hint = $('.scroll_hint');
  const $ship = $('.spaceship');
  const $upText = $('.up_text');
  const text1 = "MY PLANETS";
  
  function typeText($el, text, speed, callback) {
    let i = 0;
    $el.text('');
    $el.css('opacity', 1).addClass('visible'); // ✅ 여기 추가
    const interval = setInterval(() => {
      $el.text(text.slice(0, ++i));
      if (i >= text.length) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, speed);
  }
  
  function startTypingAndFly() {
    if (isTyping || isIntroPlayed) return;
  
    isTyping = true;
    isIntroPlayed = true;
  
    $text1.text('').css('opacity', 0);
    $upText.css({ opacity: 0, transform: 'translateY(-20px)' });
    $hint.fadeOut();
  
    $ship.removeClass('on');
    void $ship[0].offsetWidth;
    $ship.addClass('on');
  
    typeText($text1, text1, 100, () => {
      // up_text 재등장
      gsap.fromTo($upText,
        { opacity: 0, y: -20 },       // 시작 상태
        {
          opacity: 1,
          y: 0,                       // 끝 상태
          delay: 0.3,                 // ✨ 딜레이 유지 가능!
          duration: 1.2,
          ease: 'power2.out'
        }
      );
      
      // 힌트는 미리 살짝 빨리 등장
      setTimeout(() => {
        isTyping = false;
        $hint.fadeIn(800, () => {
          $hint.addClass('blinking');
        });
      }, 1000); // ← 원하는 타이밍 조정 가능
    });
  }
  
  function forceIntroStart() {
    isTyping = false;
    isIntroPlayed = false;
    startTypingAndFly();
    $('body').addClass('scroll-lock');
  }
  
  // 스크롤 트리거
  ScrollTrigger.create({
    trigger: '.intro',
    start: 'top top',
    end: '+=100%',
    pin: true,
    onEnter: forceIntroStart,
    onEnterBack: forceIntroStart,
    onLeave: () => {
      $('body').removeClass('scroll-lock');
      $hint.fadeOut();
    },
    onLeaveBack: () => {
      $('body').removeClass('scroll-lock');
      $hint.fadeOut();
    }
  });
  
  // ↓NEXT 클릭 시 다음 섹션 이동
  $hint.on('click', function () {
    $('body').removeClass('scroll-lock');
    $hint.fadeOut();
    $('html, body').animate({ scrollTop: $('.projects').offset().top }, 600);
  });
  
  



  /* 궤도 애니 */
  function animateOrbitPaths() {
    $('.orbit_path').each(function (i, el) {
      const length = el.getTotalLength();

      // 완벽한 초기화
      gsap.set(el, {
        strokeDasharray: length,
        strokeDashoffset: length
      });

      // 애니메이션
      gsap.to(el, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power2.out",
        delay: i * 0.4
      });
    });
  }
  let hasPlanetAnimated = false;

  function animatePlanets() {
    $('.section3 .projects .orbit_wrap article').each(function (i, el) {
      $(el).css('pointer-events', 'none');
      gsap.fromTo(el,
        {
          opacity: 0,
          onStart: () => el.style.pointerEvents = 'none'
        },
        {
          opacity: 1,
          pointerEvents: "auto",
          duration: 1,
          delay: 1.6 + i * 0.3,
          ease: "power2.out",
          onComplete: () => el.style.pointerEvents = 'auto'
        });
    });

    hasPlanetAnimated = true;
  }

  function resetPlanets() {
    $('.section3 .projects .orbit_wrap article').each(function (i, el) {
      gsap.set(el, {
        opacity: 0,
        pointerEvents: "none"
      });
    });

    hasPlanetAnimated = false; // ✅ 다시 애니 가능하게 리셋
  }
  ScrollTrigger.create({
    trigger: '.section3 .projects',
    start: 'top 80%',
    onEnter: () => {
      animateOrbitPaths();
      animatePlanets(); // ✅ 위에서 아래로 진입 시 애니
    },
    onEnterBack: () => {
      animateOrbitPaths();
      resetPlanets();   // ✅ 먼저 초기화하고
      setTimeout(() => animatePlanets(), 50); // ✅ 짧은 시간 후 재실행
    },
    onLeaveBack: () => {
      resetPlanets();
    },
    once: false
  });



  const orbitCherrisy = gsap.to(".cherrisy", {
    duration: 30,
    repeat: -1,
    ease: "none",
    motionPath: {
      path: "#orbitPath3",
      align: "#orbitPath3",
      autoRotate: false,
      alignOrigin: [0.5, 0.5]
    }
  });

  const orbitIrun = gsap.to(".irun", {
    duration: 20,
    repeat: -1,
    ease: "none",
    motionPath: {
      path: "#orbitPath2",
      align: "#orbitPath2",
      autoRotate: false,
      alignOrigin: [0.5, 0.5]
    }
  });

  const orbitNivea = gsap.to(".nivea", {
    duration: 10,
    repeat: -1,
    ease: "none",
    motionPath: {
      path: "#orbitPath1",
      align: "#orbitPath1",
      autoRotate: false,
      alignOrigin: [0.5, 0.5]
    }
  });
  $('.projects .planets').hover(
    function () {
      orbitCherrisy.pause();
      orbitIrun.pause();
      orbitNivea.pause();
    },
    function () {
      orbitCherrisy.resume();
      orbitIrun.resume();
      orbitNivea.resume();
    }
  );

  /* #send_signal */

  //무한루프 텍스트
  $(window).on('load', function () {
    const $track = $('.txtAniBox .txtAni');
    const $clone = $track.clone();
    $track.parent().append($clone);

    const fullWidth = $track[0].offsetWidth;

    gsap.set($clone[0], { x: fullWidth });

    gsap.to([$track[0], $clone[0]], {
      x: `-=${fullWidth}`,
      duration: 25, // 빠르게: 10~15
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % fullWidth)
      }
    });
  });
  //심플리 스크롤
  // $('.txtAniBox .txtAni').simplyScroll({
  //   speed: 2,
  //   frameRate: 15, // 기본은 40, 숫자 낮을수록 빠름
  //   pauseOnHover: false,
  //   pauseOnTouch: true,
  //   direction: 'forwards',
  // });


  //마우스 무브 라인
  const canvas = document.getElementById('mouseTrailCanvas');
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('send_signal');

  let width = canvas.width = section.clientWidth;
  let height = canvas.height = section.clientHeight;
  let trail = [];

  window.addEventListener('resize', () => {
    width = canvas.width = section.clientWidth;
    height = canvas.height = section.clientHeight;
  });

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    trail.push({ x, y, alpha: 1.0 });
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    for (let i = 0; i < trail.length - 1; i++) {
      const p1 = trail[i];
      const p2 = trail[i + 1];
      ctx.strokeStyle = `rgba(9, 183, 0, ${p1.alpha})`;
      ctx.lineWidth = 2;
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    }
    ctx.stroke();

    // 점점 흐려지게
    trail.forEach(p => p.alpha -= 0.02);
    trail = trail.filter(p => p.alpha > 0);

    requestAnimationFrame(draw);
  }

  draw();

  document.querySelectorAll('.contacts li').forEach((el) => {
    // 둥둥 떠다니는 애니메이션
    const float = gsap.to(el, {
      x: () => gsap.utils.random(-50, 50),
      y: () => gsap.utils.random(-50, 50),
      duration: () => gsap.utils.random(2, 4),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 호버 시 멈추고 덜컹 애니메이션
    el.addEventListener("mouseenter", () => {
      float.pause(); // 떠다니는 거 멈추고

      gsap.timeline()
        .to(el, { skewX: -12, duration: 0.1, ease: "power1.out" })
        .to(el, { skewX: 10, duration: 0.1, ease: "power1.out" })
        .to(el, { skewX: -6, duration: 0.1, ease: "power1.out" })
        .to(el, { skewX: 4, duration: 0.1, ease: "power1.out" })
        .to(el, { skewX: -2, duration: 0.1, ease: "power1.out" })
        .to(el, { skewX: 0, duration: 0.2, ease: "power2.out" });
    });


    // 호버 해제 시 다시 재생
    el.addEventListener("mouseleave", () => {
      float.play();
    });
  });




}); //ready end