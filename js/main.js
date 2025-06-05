gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin);
$(function () {
  // if ('scrollRestoration' in history) {
  //   history.scrollRestoration = 'manual';
  // }

  function updateGNBLink() {
    const isMobile = window.innerWidth <= 1024;

    const $gnbLink = $('.g_icon2 a');

    if (isMobile) {
      $gnbLink.attr('href', '#my_planetsM');
    } else {
      $gnbLink.attr('href', '#my_planets');
    }
  }

  // 최초 실행
  updateGNBLink();

  // 창 크기 변경 시 재확인
  $(window).on('resize', function () {
    updateGNBLink();
  });

  document.querySelector('.down').addEventListener('click', () => {
    const targetSection = document.querySelector('#mission_log'); // 또는 .section2
    targetSection.scrollIntoView({
      behavior: 'smooth'
    });
  });
  $('a').on('click', function (e) {
    e.preventDefault(); // 기본 동작 막기

    const href = $(this).attr('href');
    const isExternal = $(this).attr('target') === '_blank';
    const isMail = href.startsWith('mailto:');

    const scrollY = window.scrollY;

    setTimeout(() => {
      if (isMail) {
        window.location.href = href;
      } else if (isExternal) {
        window.open(href, '_blank');
      } else {
        window.location.href = href;
      }

      // 위치 복구
      window.scrollTo(0, scrollY);
    }, 50); // 브라우저 처리 직전에 스크롤 복원
  });


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

  function setupFloatingContacts() {
    document.querySelectorAll('.contacts li').forEach((el) => {
      gsap.killTweensOf(el); // 기존 트윈 제거
      const float = gsap.to(el, {
        x: () => gsap.utils.random(-50, 50),
        y: () => gsap.utils.random(-50, 50),
        duration: () => gsap.utils.random(2, 4),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      el.onmouseenter = null;
      el.onmouseleave = null;

      if (window.innerWidth > 1024) {
        el.addEventListener("mouseenter", () => {
          float.pause();
          gsap.timeline()
            .to(el, { skewX: -12, duration: 0.1 })
            .to(el, { skewX: 10, duration: 0.1 })
            .to(el, { skewX: -6, duration: 0.1 })
            .to(el, { skewX: 4, duration: 0.1 })
            .to(el, { skewX: -2, duration: 0.1 })
            .to(el, { skewX: 0, duration: 0.2 });
        });
        el.addEventListener("mouseleave", () => {
          float.play();
        });
      }
    });
  }

  // 최초 실행
  setupFloatingContacts();

  // 💡 리사이즈 시 다시 바인딩
  window.addEventListener('resize', () => {
    setupFloatingContacts();
  });

 
}); //ready end