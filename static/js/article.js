//给所有的action类绑定事件
$('.action').click(function () {
    //朝后端发送ajax请求
    var cDiv = $(this);
    $.ajax({
        url: '/updown/',
        type: 'post',
        data: {
            'article_id': '{{ article_obj.pk }}',
            'is_up': $(this).hasClass('diggit'),
            'csrfmiddlewaretoken': "{{ csrf_token }}",
        },
        success: function (args) {
            if (args.code === 10000) {
                $(".clear").html(args.msg)
                // 将对于的标签内的文本自增一
                var innerT = cDiv.text();
                // 文本是字符串 需要转数字再加
                cDiv.children().text(Number(innerT) + 1)
            } else {
                $(".clear").html(args.msg)
            }
        }
    })
})

// 根评论功能
$("#plBtn").click(function () {
    var tFlag = $(this)
    var content = $("#content").val();
    $.ajax({
        url: "/comment/",
        type: "post",
        data: {
            'csrfmiddlewaretoken': '{{ csrf_token }}',
            "content": content,
            'article_id': '{{ article_obj.pk }}',
        },
        success: function (args) {
            if (args.code === 10000) {
                oHtml = `<div class="comment-show-con clearfix">
<div class="comment-show-con-img pull-left"><img src="{{ request.user.avatar.url }}" alt="头像"></div>
<div class="comment-show-con-list pull-left clearfix" comment_id="${args.pk}">
    <div class="pl-text clearfix"> <a href="/{{ request.user.username }}/" class="comment-size-name" style="font-size: 15px">{{ request.user.username }}</a>:
        <span class="my-pl-con">&nbsp;${content}</span>
    </div>
    <div class="date-dz"> <span class="date-dz-left pull-left comment-time" style="font-size: 13px">${args.ctime}</span>
    <div class="date-dz-right pull-right comment-pl-block"><a href="javascript:;" class="removeBlock">删除</a>
        <a href="javascript:;" ToUser="{{ request.user.username }}" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a>
    </div>
</div>
<div class="hf-list-con"></div>
</div> </div>`;

                tFlag.parents('.reviewArea ').siblings('.comment-show').prepend(oHtml);
                tFlag.siblings('.flex-text-wrap').find('.comment-input').prop('value', '').siblings('pre').find('span').text('');
            } else {
                $(".clear").html(args.msg)
            }
        }
    })
})

// 创建回复评论块
$('.comment-show').on('click', '.pl-hf', function () {

    $(".hf-con").remove().prev(".date-dz-right").children(".date-dz-pl").addClass("hf-con-block")

    var fhName = $(this).parents('.date-dz-right').parents('.date-dz').siblings('.pl-text').find('.comment-size-name').html();
    //回复@
    var fhN = '回复@' + fhName;
    //var oInput = $(this).parents('.date-dz-right').parents('.date-dz').siblings('.hf-con');
    var fhHtml = `<div class="hf-con pull-left">
<textarea class="content comment-input hf-input" placeholder=${fhN}></textarea>
<a href="javascript:;" class="hf-pl">评论</a></div>`;
    //显示回复
    if ($(this).is('.hf-con-block') && !($(this).is(".hf-self"))) {
        $(this).parents('.date-dz-right').parents('.date-dz').append(fhHtml);
        $(this).removeClass('hf-con-block');

        $('.content').flexText();
        $(this).parents('.date-dz-right').siblings('.hf-con').find('.pre').css('padding', '6px 15px');
        //console.log($(this).parents('.date-dz-right').siblings('.hf-con').find('.pre'))
        //input框自动聚焦
        $(this).parents('.date-dz-right').siblings('.hf-con').find('.hf-input').val('').focus().val(fhN);
    } else {
        $(this).addClass('hf-con-block');
        $(this).parents('.date-dz-right').siblings('.hf-con').remove();
    }
});

// 回复评论功能
$('.comment-show').on('click', '.hf-pl', function () {
    var oThis = $(this);
    //获取输入内容
    if ($(this).parent().parent().parent().parent().is(".hf-list-con")) {
        comment_id = $(this).parent().parent().parent().parent(".hf-list-con").parent(".comment-show-con-list").attr("comment_id");
    } else {
        comment_id = $(this).parent().parent(".date-dz").parent(".comment-show-con-list").attr("comment_id");
    }
    var reply = $(this).prev('.hf-input').val();

    var ToUser = $(this).parents('.hf-con').parents('.date-dz').prev(".pl-text").find('.comment-size-name').html()
    var oAllVal = "{{ request.user.username }}" + '回复@' + ToUser;
    $.ajax({
        url: "/comment_reply/",
        type: "post",
        data: {
            'csrfmiddlewaretoken': '{{ csrf_token }}',
            "comment_id": comment_id,
            'reply': reply,
            "to_user": ToUser,
        },
        success: function (args) {
            if (args.code === 10000) {
                var oAt = `回复<a style="font-size: 15px" href="/${ToUser}/" class="atName">@` + ToUser + '</a> : ' + reply;

                var oHtml = `<div class="all-pl-con" reply="${args.pk}">
                        <div class="pl-text hfpl-text clearfix"><a style="font-size: 15px"
                        href="/{{ request.user.username }}/" class="comment-size-name">{{ request.user.username }}</a><span class="my-pl-con">` + ' : ' + oAt + '</span></div><div class="date-dz"> <span style="font-size:13px" class="date-dz-left pull-left comment-time">' + args.ctime + '</span> <div class="date-dz-right pull-right comment-pl-block"> <a href="javascript:;" class="removeBlock">删除</a> <a href="javascript:;" class="date-dz-pl pl-hf hf-con-block pull-left">回复</a></div> </div></div>';
                oThis.parents('.hf-con').parents('.comment-show-con-list').find('.hf-list-con').css('display', 'block').prepend(oHtml) && oThis.parents('.hf-con').siblings('.date-dz-right').find('.pl-hf').addClass('hf-con-block') && oThis.parents('.hf-con').remove();
            }
        }
    })

});


$('.commentAll').on('click', '.removeBlock', function () {
    var Ts = $(this)
    var oT = $(this).parents('.date-dz-right').parents('.date-dz').parents('.all-pl-con');
    var replyPk = oT.attr("reply")
    var commentPk = $(this).parent(".date-dz-right").parent(".date-dz").parent(".comment-show-con-list").attr("comment_id")
    $.ajax({
        url: "{% url 'comment_del' %}",
        type: "post",
        data: {
            "csrfmiddlewaretoken": "{{ csrf_token }}",
            "comment_id": commentPk,
            "reply_id": replyPk,
        },
        success: function (args) {
            // 删除子评论
            if (args.code === 12000) {
                oT.remove();
            } else if (args.code === 11000) {  // 删除根评论
                Ts.parent(".date-dz-right").parent(".date-dz").parent(".comment-show-con-list").parent(".comment-show-con").remove()
            } else {
                alert(args.msg)
            }

        }
    })
})

$(".blog-main img").removeAttr("style")





