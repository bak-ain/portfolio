$(function(){
    AOS.init();
    //네비게이션
    $('nav .nav_bg, nav ul.gnb li').hover(function(){
        $('nav .nav_bg, nav ul.gnb li ul.sub').stop().slideDown();
    },function(){
        $('nav .nav_bg, nav ul.gnb li ul.sub').stop().slideUp();
    });
    //top_btn
    $(window).on('scroll', function(){
        let st = $(this).scrollTop();
        // console.log(st);
        if(st>=300){
            $('.top_btn').css({
                display : 'flex'
            });
        }else{
            $('.top_btn').css({
                display : 'none'
            });
        }
    });

    //main_banner
    let mainSlide = new Swiper(".main_banner", {
        autoplay: {
            delay: 2500,
        },
        loop: true,
        pagination: {
            el: ".main_banner .swiper-pagination",
            clickable: true,
        },
    });
    $('.main_banner .swiper-slide').hover(function(){
        mainSlide.autoplay.stop();
      }, function(){
        mainSlide.autoplay.start();
      });

    //menu
    let menuSlide = new Swiper(".menu_card", {
        slidesPerGroup: 4,
        slidesPerView: 4,
        spaceBetween: 20,
        loop: true,
        navigation: {
            nextEl: ".m_rt",
            prevEl: ".m_lt",
        },
    });

    //sns
/*     let snsSlide = new Swiper(".sns_slide", {
        slidesPerGroup: 4,
        slidesPerView: 'auto',
        // slidesPerGroupAuto: false,
        spaceBetween: 15,
        loop: true,
        autoplay: {
            delay: 2000,
        },
    });
    $('.sns_slide .swiper-slide').hover(function(){
        snsSlide.autoplay.stop();
      }, function(){
        snsSlide.autoplay.start();
      }); */
      $('.sns_slide').simplyScroll({
        speed: 5, frameRate: 60,
        });

    //tab
    $('.youtube .contents .right_box ul.thumbnail li').click(function(){
        let i = $(this).index();
        $('.youtube .contents .img_box li,.youtube .contents .right_box ul.thumbnail li').removeClass('on')
        $(this).addClass('on');
          $('.youtube .contents .img_box li').eq(i).addClass('on');
    });
}); //ready end