gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin);
$(function(){
/* 타이핑 */
let isTyping = false;
let isIntroPlayed = false;
let typingInterval1 = null;
let typingIntervalLoop = null;

const $text1 = $('.typing_text1');
const $hint = $('.scroll_hint');
const $ship = $('.spaceship');

const $typingEm = $('.em_typing em');
const $restText = $('.rest_text');

const text1 = "MY PLANETS";
const emText = "AIN UNIVERSE";

function typeLoop($el, text, speed) {
  if (typingIntervalLoop) clearInterval(typingIntervalLoop); // ✅ 중복 방지
  let i = 0;
  function loopTyping() {
    i = 0;
    $el.text('');
    typingIntervalLoop = setInterval(() => {
      $el.text(text.slice(0, ++i));
      if (i >= text.length) {
        clearInterval(typingIntervalLoop);
        setTimeout(loopTyping, 1000); // 반복 간격
      }
    }, speed);
  }
  loopTyping();
}


function typeElement($el, fullText, speed, callback) {
  $el.html('');
  $el.addClass('visible');
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

function startTypingAndFly() {
  if (isTyping || isIntroPlayed) return;

  isTyping = true;
  isIntroPlayed = true;

  $text1.html('').removeClass('visible');
  $typingEm.text('');
  $restText.css({ opacity: 0, transform: 'translateX(-30px)' });
  $hint.fadeOut();

  clearInterval(typingInterval1);
  clearInterval(typingIntervalLoop);  // ✅ 이전 타이핑 루프 완전히 제거

  $ship.removeClass('on');
  void $ship[0].offsetWidth;
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
          $hint.fadeIn();
        }
      });
  });
}

// 스크롤 힌트 클릭 → 다음 섹션 이동
$hint.on('click', function () {
  $('body').removeClass('scroll-lock');
  $hint.fadeOut();
  $('html, body').animate({ scrollTop: $('.projects').offset().top }, 600);
});

function forceIntroStart() {
  isTyping = false;
  isIntroPlayed = false;
  startTypingAndFly();
  $('body').addClass('scroll-lock');
}
function resetIntro() {
  clearInterval(typingInterval1);
  clearInterval(typingIntervalLoop);

  $text1.html('').removeClass('visible');
  $typingEm.text('');
  $restText.css({ opacity: 0, transform: 'translateX(-30px)' });
  $hint.hide();
  $ship.removeClass('on');

  isTyping = false;
  isIntroPlayed = false;
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
    resetIntro(); // ✅ 나갈 때 초기화
  },
  onLeaveBack: () => {
    $('body').removeClass('scroll-lock');
    resetIntro(); // ✅ 다시 위로 나갈 때도 초기화
  }
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


})