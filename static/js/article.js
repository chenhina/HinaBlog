$(".blog-main img").removeAttr("style")
$(".blog-main ol li").css("list-style", "aaa")
//回到顶部特效
$('body').prepend(`<a href="#" class="cd-top faa-float animated cd-fade-out"></a>`);
let $win = $(window);
let oldScrollY = 0;
$win.scroll(function () {
    oldScrollY = this.scrollY;
    let height = window.innerHeight;
    let top = '-' + (900 - height + 80) + 'px';
    if (oldScrollY > 0) {
        $('.cd-top').css('top', top);
    } else {
        $('.cd-top').css('top', '-900px');
    }
});


