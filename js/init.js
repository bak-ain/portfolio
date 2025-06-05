// ✅ init.js

// 전역 상태 관리 (공통 변수)
let isDragging = false;
let hasDragged = false;
let isNavigatingFromGNB = false;
let isMobilePortalInitialized = false;
let hiddenPortalTrigger = null;
let projectsSlide = null;
let typingInterval1 = null;
let typingIntervalLoop = null;

// ✅ 인트로 초기화
function initIntro() {
  if (window.innerWidth > 1024) {
    // PC용 intro.js 초기화
    initPCIntro();
  }
}

// ✅ 메인 섹션 초기화
function initMainSection() {
  toggleLayoutClass();
  window.addEventListener("resize", () => {
    toggleLayoutClass();
    setTimeout(() => {
      if (window.innerWidth > 1024) {
        initScrollTriggers();
      }
      ScrollTrigger.refresh();
    }, 100);
  });
}

// ✅ mission.js 초기화
function initMissionSection() {
  if (window.innerWidth > 1024) {
    initMissionScroll();
  }
}

// ✅ MY PLANETS (PC)
function initMyPlanetsPC() {
  if (window.innerWidth > 1024) {
    initPlanetsScroll();
    initTypingAnimation();
  }
}

// ✅ MY PLANETS (Mobile)
function initMyPlanetsMobile() {
  if (window.innerWidth <= 1024) {
    initMobilePlanets();
  }
}

// ✅ 히든포탈 영역 초기화
function initPortalSection() {
  toggleLayoutClass();
  $(window).on("resize", toggleLayoutClass);

  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
}

// ✅ 상태 해제 함수들 (각각의 섹션에서 필요시 사용)
function killPCTriggersAndIntervals() {
  ScrollTrigger.getAll().forEach((st) => st.kill());
  clearInterval(typingInterval1);
  clearInterval(typingIntervalLoop);
}

function killMobileTriggersAndIntervals() {
  clearInterval(typingInterval1);
  clearInterval(typingIntervalLoop);
  if (projectsSlide) {
    projectsSlide.destroy(true, true);
    projectsSlide = null;
  }
}
