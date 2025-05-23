gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin);
$(function () {

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
  /* 반응형 */


  let missionScrollTrigger = null;
  let missionSwiper = null;

  // ✅ 모바일 또는 태블릿 감지
  function isMobileOrTablet() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const min = Math.min(w, h);
    const max = Math.max(w, h);
    return min < 768 || max <= 1366;
  }

  // ✅ 초기 분기 처리
  function initMissionSection() {
    const isSmallScreen = isMobileOrTablet();
    const section = document.querySelector('.section2');

    if (isSmallScreen && !section.classList.contains('swiper')) {
      convertToSwiper();
    } else if (!isSmallScreen && section.classList.contains('swiper')) {
      convertToScrollTrigger();
    }
  }

  // ✅ Swiper로 전환
  function convertToSwiper() {
    const section = document.querySelector('.section2');
     // 1. 기존 pagination DOM 먼저 저장
  const paginationEl = document.querySelector('.swiper-pagination.my_pg2');

    if (missionScrollTrigger) {
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.set(section, { clearProps: 'all' });
    }

    section.classList.add('swiper');
    const wrapper = document.createElement('div');
    wrapper.classList.add('swiper-wrapper', 'horizontal_wrapper');

    const articles = Array.from(section.querySelectorAll('article'));
    articles.forEach(article => {
      article.classList.add('swiper-slide');
      wrapper.appendChild(article);
    });

    section.innerHTML = '';
    section.appendChild(wrapper);
    section.appendChild(paginationEl); // ✅ 이거 여기!

    let offset;

    if (window.innerWidth <= 768) {
      // 모바일: 더 작은 offset (예: 5%)
      offset = window.innerWidth * 0.05;
    } else {
      // 태블릿/PC: 기본값 (예: 10%)
      offset = window.innerWidth * 0.1;
    }

    const missionSwiper = new Swiper('.section2.swiper', {
      slidesPerView: 'auto',
      spaceBetween: offset,
      slidesOffsetBefore: offset,
      slidesOffsetAfter: offset,
      pagination: {
        el: ".swiper-pagination.my_pg2",
        clickable: true,
      },
    });

  }

  // ✅ ScrollTrigger로 전환
  function convertToScrollTrigger() {
    const section = document.querySelector('.section2');

    if (missionSwiper) {
      missionSwiper.destroy(true, true);
      missionSwiper = null;
    }

    section.classList.remove('swiper');
    const wrapper = section.querySelector('.swiper-wrapper');
    const slides = Array.from(wrapper.children);

    wrapper.remove();
    slides.forEach(slide => {
      slide.classList.remove('swiper-slide');
      section.appendChild(slide);
    });

    const cards = gsap.utils.toArray('.section2 article');
    const totalScrollLength = section.scrollWidth - window.innerWidth;

    missionScrollTrigger = gsap.to(section, {
      x: -totalScrollLength,
      ease: 'none',
      scrollTrigger: {
        id: 'horizontalScroll',
        trigger: section,
        start: 'top top',
        end: () => `+=${totalScrollLength}`,
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    cards.forEach(card => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${totalScrollLength}`,
        scrub: 0.5,
        onUpdate: (self) => {
          const scrollX = -gsap.getProperty(section, 'x');
          const centerX = scrollX + window.innerWidth / 2;
          const cardLeft = card.offsetLeft;
          const cardRight = cardLeft + card.offsetWidth;
          const extendedRange = 200;
          const isVisible = cardRight > scrollX + window.innerWidth * 0.25 - extendedRange &&
            cardLeft < scrollX + window.innerWidth * 0.75 + extendedRange;
          card.classList.toggle('show', isVisible);
        }
      });
    });
  }

  // ✅ 초기 실행 + 반응형 대응
  initMissionSection();
  window.addEventListener('resize', () => {
    initMissionSection();
  });

})