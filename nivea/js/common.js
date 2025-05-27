$(function () {
  // 헤더와 푸터 먼저 로드
  $('#header').load('inc/header.html', function () {
    // ✅ 헤더가 완전히 로드된 후 실행되는 초기화
    initHeaderScripts();
  });

  $('#footer').load('inc/footer.html');

  // ✅ 공통 함수로 묶어둠
  function initHeaderScripts() {
    // 네비게이션 호버
    $('nav .nav_bg, nav ul.gnb li').hover(function () {
      $('nav .nav_bg, nav ul.gnb li ul.sub').stop().slideDown();
    }, function () {
      $('nav .nav_bg, nav ul.gnb li ul.sub').stop().slideUp();
    });

    // 헤더 스크롤 시 클래스 추가
    $(window).on('wheel mousewheel DOMMouseScroll', function (e) {
      let delta = e.originalEvent.deltaY || -e.originalEvent.wheelDelta || e.originalEvent.detail;
      if (delta > 0) {
        $("header").addClass("sc");
      } else {
        $("header").removeClass("sc");
      }
    });

    // 리사이즈 시 스크롤 이벤트 해제
    $(window).on("resize", function () {
      if ($(window).width() <= 1580) {
        $(window).off("wheel mousewheel DOMMouseScroll");
      }
    });

    // 햄버거 열기
    $('.ham').click(function () {
      $('.fix').animate({ left: 0 }, 500, 'linear');
    });

    // 햄버거 닫기
    $('.fix .close').click(function () {
      $('.fix').animate({ left: -1000 }, 500, 'linear');
    });

    // 서브 메뉴 토글
    $('.fix .ham_gnb li button').click(function () {
      $(this).parent().find('ul.ham_sub').toggleClass('on');
    });

    // 상단 버튼
    $('.top_btn, .sc_btn').click(function () {
      $('header').removeClass('sc');
    });

    // 스크롤 시 top 버튼 표시
    $(window).on('scroll', function () {
      let st = $(this).scrollTop();
      if (st >= 300) {
        $('.top_btn').addClass('on');
      } else {
        $('.top_btn').removeClass('on');
      }
    });
  }
});


    //console.log(topOff)
    /* header */
    // $(window).on('scroll', function () {
    //     let st = $(this).scrollTop();
    //     // console.log(st);
    //     if (st >= topOff) {
    //         $('header').addClass('sc');
    //     } else {
    //         $('header').removeClass('sc');}});
    // $(window).on("wheel", function (e) {
    //     let delta = e.originalEvent.deltaY; // 최신 브라우저는 deltaY만 사용
    //     console.log(delta);
        
    //     if (delta > 0) {
    //         $("header").addClass("sc"); // 아래로 스크롤
    //     } else {
    //         $("header").removeClass("sc"); // 위로 스크롤
    //     }
    // });