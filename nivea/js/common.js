$(function () {
    //네비게이션
    $('nav .nav_bg, nav ul.gnb li').hover(function () {
        $('nav .nav_bg, nav ul.gnb li ul.sub').stop().slideDown();
    }, function () {
        $('nav .nav_bg, nav ul.gnb li ul.sub').stop().slideUp();
    });
    
    $(window).on('wheel mousewheel DOMMouseScroll', function (e) {
        let delta = e.originalEvent.deltaY || -e.originalEvent.wheelDelta || e.originalEvent.detail;
        if (delta > 0) {
            $("header").addClass("sc");
        } else {
         $("header").removeClass("sc");
        }
    });
    
    /* resize */
    $(window).on("resize", function () {
        if ($(window).width() <= 1580) {
            $(window).off("wheel mousewheel DOMMouseScroll");
        }
    });

    /* ham */
    $('.ham').click(function(){
        $('.fix').animate({
            left: 0
        },500,'linear')
    });
    $('.fix .close').click(function(){
        $('.fix').animate({
            left: -1000
        },500,'linear')});

    $('.fix .ham_gnb li button').click(function(){
      $(this).parent().find('ul.ham_sub').toggleClass('on')
    }) 
        
    /* top_btn search */
    $(window).on('scroll', function () {
        let st = $(this).scrollTop();
        // console.log(st);
        if (st >= 300) {
            $('.top_btn').addClass('on');
        } else {
            $('.top_btn').removeClass('on');
        }

    });

    
    $('.top_btn, .sc_btn').click(function(){
        $('header').removeClass('sc')
    })

    
});//ready end

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