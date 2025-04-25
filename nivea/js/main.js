$(function () {
    AOS.init();
    // 초기 로드 시 첫 번째 비디오 재생
    // controlVideos(videoSlide);
    // $(window).on("resize", function () {
    //     AOS.refresh(); // 리사이즈될 때 AOS 다시 적용
    //   });
    // $(window).on("resize", function () {
    //     $("[data-aos-anchor-placement]").each(function () {
    //         if ($(window).width() < 900) {
    //             $(this).attr("data-aos-anchor-placement", "top-bottom");
    //         } else {
    //             $(this).attr("data-aos-anchor-placement", "top-center");
    //         }
    //     });

    //     AOS.refreshHard(); 
    // });

    /* promotion_video */
    function controlVideos(swiper) {
        $('.promotion .video_slide_wrap>li>video').each(function (index, video) {
            if (index === swiper.activeIndex) {
                video.play();
                video.controls = true;

            } else {
                video.pause();
                video.controls = false;
                video.currentTime = 0; // 처음부터 재생
            }
        });
    }

    let videoSlide = new Swiper(".promotion_video", {
        initialSlide: 1,
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        on: {
            slideChange: function () {
                controlVideos(this);
            },
        },
        coverflowEffect: {
            rotate: 0,
            scale: 0.8,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
        },
    });

    /* resize */
    $(window).on("resize", function () {
        let winWidth = $(window).width();
        let $video = $(".pv");

        if (winWidth <= 900) {
            $video.css({ width: "350px", height: "190px" });
        } else if (winWidth <= 1580) {
            $video.css({ width: "800px", height: "436px" });
        } else {
            $video.css({ width: "1100px", height: "600px" });
        }
    }).trigger("resize"); // 페이지 로드 시 한 번 실행

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
    $('.main_banner .swiper-slide').hover(function () {
        mainSlide.autoplay.stop();
    }, function () {
        mainSlide.autoplay.start();
    });

});//ready end