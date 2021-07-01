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


/**
 * 构建博客目录
 */
function buildPostCatalog() {
    var levels = ["h2", "h3", "h4", "h5"];
    var mainContent = $('.blog-main');
    var $headers = $(".blog-main").find(levels.join(','));
    console.log($headers)
    if (mainContent.length < 1) {
        return false;
    }

    let $catalog = $(
        `<div class="esa-catalog">
                        <div class="esa-catalog-contents">
                            <div class="esa-catalog-title">目录</div>
                            <a class="esa-catalog-close">✕</a>
                        </div>
                    </div>`);

    let h1c = 0;
    let h2c = 0;
    let h3c = 0;

    let catalogContents = '<ul>';

    let cryptoObj = window.crypto || window.msCrypto; // for IE 11
    let eleIds = cryptoObj.getRandomValues(new Uint32Array($headers.length));

    $.each($headers, (index, header) => {
        const tagName = $(header)[0].tagName.toLowerCase();
        let titleIndex = '';
        let titleContent = $(header).text();
        let title = titleContent;
        if (1 === 1) {
            switch (tagName) {
                case "h2":
                    titleContent = `<span class="level1">${titleContent}</span>`;
                    break;
                case "h3":
                    titleContent = `<span class="level2">${titleContent}</span>`;
                    break;
                case "h4":
                    titleContent = `<span class="level3">${titleContent}</span>`;
                    break;
            }
        } else {
            if (tagName === "h2") {
                h1c++;
                h2c = 0;
                h3c = 0;
                titleIndex = `<span class="level1">${h1c}. </span>`;
            } else if (tagName === "h3") {
                h2c++;
                h3c = 0;
                titleIndex = `<span class="level2">${h1c}.${h2c}. </span>`;
            } else if (tagName === "h4") {
                h3c++;
                titleIndex = `<span class="level3">${h1c}.${h2c}.${h3c}. </span>`;
            }
        }

        var idx = eleIds[index];

        catalogContents +=
            `<li class="li_${tagName}" title="${title}">
                            <i class="${idx}" ></i><a class="esa-anchor-link">${(titleIndex + titleContent)}</a>
                        </li>`;

        $(header).attr('id', `${idx}`)
            .html(`<span>${titleContent}</span><a href="#${idx}" class="esa-anchor">#</a>`)
            .hover(() => {
                $(header).find('.esa-anchor').css('opacity', 1);
            }, () => {
                $(header).find('.esa-anchor').css('opacity', 0);
            });
    });
    catalogContents += `</ul>`;

    $catalog.find('.esa-catalog-contents').append(catalogContents);
    $catalog.appendTo('body');

    let $tabContent = $('.esa-catalog-contents');

    $tabContent.fadeIn();

    $('.esa-anchor-link').on('click', function () {
        let position = $('#' + ($(this).prev('i').attr('class'))).offset().top - 80;
        $('html, body').animate({
            scrollTop: position
        }, 300);
    });

    $('.esa-catalog-close').on('click', () => {
        $tabContent.hide();
    });

    if (1 === 1) {
        let move = {
            start: false,
            pois: [0, 0],
        };
        $('.esa-catalog-title').on('mousedown', function (e) {
            e.preventDefault();
            move.start = true;
            let position = $('.esa-catalog').position();
            let poisX = e.clientX - parseFloat(position.left);
            let poisY = e.clientY - parseFloat(position.top);
            move.pois = [poisX, poisY];
        });
        $(document).on('mousemove', (e) => {
            if (move.start) {
                let offsetX = e.clientX - move.pois[0];
                let offsetY = e.clientY - move.pois[1];
                let fixed = $('.esa-catalog').css('position') === 'fixed';

                e.preventDefault();

                move.stX = fixed ? 0 : $(window).scrollLeft();
                move.stY = fixed ? 0 : $(window).scrollTop();

                let setRig = $(window).width() - $('.esa-catalog').outerWidth() + move.stX;
                let setBot = $(window).height() - $('.esa-catalog').outerHeight() + move.stY;

                offsetX < move.stX && (offsetX = move.stX);
                offsetX > setRig && (offsetX = setRig);
                offsetY < move.stY && (offsetY = move.stY);
                offsetY > setBot && (offsetY = setBot);

                $('.esa-catalog').css({
                    left: offsetX,
                    top: offsetY,
                    right: 'auto',
                });
            }
        }).on('mouseup', (_e) => {
            if (move.start) {
                move.start = false;
            }
        });
    }
}

buildPostCatalog()