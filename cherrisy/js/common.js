$(function(){
    /* header */
    $(window).on('scroll', function(){
        let st = $(this).scrollTop();
        // console.log(st);
        if(st>=80){
            $('header').addClass('sc');
        }else{
            $('header').removeClass('sc');
        }
    });
});