import json

import arrow
from django.db.models import Q, F
from django.shortcuts import render, HttpResponse, redirect, reverse
from django.utils.safestring import mark_safe

from app01.forms import MyRegister, ArticleForm, ArticleDetailForm, CategoryForm
from app01 import models
from app01 import forms
from django.http import JsonResponse
from django.contrib import auth
from bs4 import BeautifulSoup
# Create your views here.
# pillow
from PIL import Image, ImageFont, ImageDraw

"""
Image           生成图片
ImageFont       在图片上写字
ImageDraw       字体样式
"""
from io import BytesIO, StringIO

"""
BytesIO        临时保存二进制格式数据
StringIO       临时保存字符串格式数据
"""
import random
from utils.mypage import Pagination


def register(request):
    form_obj = MyRegister()
    if request.method == "POST":
        data = {"code": 100, "msg": ""}
        # 校验普通键值对数据
        form_obj = MyRegister(request.POST)
        # 判断数据是否合法
        if form_obj.is_valid():
            # 将cleaned_data中的confirm_password键值对删除
            clean_data = form_obj.cleaned_data
            clean_data.pop("confirm_password")
            # 获取头像数据
            file_obj = request.FILES.get("avatar")
            if file_obj:
                file_obj.name = clean_data["username"] + file_obj.name
                clean_data["avatar"] = file_obj
            blog = models.Site.objects.create(site_title=(clean_data["username"] + "的Blog"))
            models.UserInfo.objects.create_user(blog=blog, **clean_data)
            data["msg"] = "注册成功"
            data["code"] = 200
            data["url"] = reverse("login")
        else:
            data["msg"] = form_obj.errors
        return JsonResponse(data)
    return render(request, "register.html", locals())


def login(request):
    if request.method == "POST":
        back_dic = {"code": 200, "msg": ""}
        username = request.POST.get("username")
        password = request.POST.get("password")
        code = request.POST.get("code")
        # 先校验验证码是否正确  忽略大小写
        if code.lower() == request.session.get("code").lower():
            # 再校验用户名密码
            user_obj = auth.authenticate(request, username=username, password=password)
            if user_obj:
                # 保存用户登录状态
                auth.login(request, user_obj)
                back_dic["msg"] = "登录成功"
                back_dic["url"] = reverse("home")
            else:
                back_dic["code"] = 10001
                back_dic["msg"] = "用户名或密码错误"
        else:
            back_dic["code"] = 10002
            back_dic["msg"] = "验证码错误"
        return JsonResponse(back_dic)
    return render(request, "login.html", locals())


def get_random():
    return random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)


def get_code(request):
    # 步骤一:简单实现 没有实际意义
    # with open(r"D:\pydir\HinaBlog\static\image\2.jpg","rb") as f:
    #     data = f.read()
    # return HttpResponse(data)

    # 步骤二:每次都能够动态地生成图片
    # image_obj = Image.new("RGB",(100,30),"red")
    # # 保存图片数据
    # with open(r"aaa.jpg","wb") as f:
    #     image_obj.save(f,"jpg")
    # with open(r"aaa.jpg", "wb") as f:
    #     data = f.read()
    # return HttpResponse(data)

    # 步骤三使用IO解决IO操作存储
    # image_obj = Image.new("RGB", (100, 30), get_random())
    # io_obj = BytesIO()
    # image_obj.save(io_obj, "png")
    # return HttpResponse(io_obj.getvalue())

    # 步骤四: 解决文字验证码问题
    """控制字体的文件基本都是以ttf结尾"""
    image_obj = Image.new("RGB", (100, 30), get_random())  # 长宽和rgb色
    img_draw = ImageDraw.Draw(image_obj)  # 将图片教给画笔对象
    img_font = ImageFont.truetype("static/font/111.otf", 25)  # 控制字体大小
    io_obj = BytesIO()
    code = ""
    # 生成随即验证码   五位随即验证码  每一个都可以是数字 字母 大小写
    for i in range(5):
        random_upper = chr(random.randint(65, 90))
        random_lower = chr(random.randint(97, 122))
        random_num = str(random.randint(0, 9))
        # 随机选一个
        rand_choice = random.choice([random_lower, random_upper, random_num])
        # 写入图片
        img_draw.text((15 + 15 * i, 0), rand_choice, get_random(), img_font)
        code += rand_choice
    # 将验证码存入session中以便后续校验
    request.session["code"] = code
    image_obj.save(io_obj, "png")
    return HttpResponse(io_obj.getvalue())


def get_query(request, field_list):
    # 传入一个列表['title', 'detail__content'], 返回一个Q对象
    query = request.GET.get('query', '')
    q = Q()
    # Q(title__contains=query) | Q(detail__content__contains=query)

    q.connector = 'OR'
    for field in field_list:
        q.children.append(Q((f"{field}__contains", query)))
    # q.children.append(Q(detail__content__contains=query))

    # Q(title__contains=query)
    # Q(('title__contains', query))

    return q


def home(request):
    q = get_query(request, ['title'])
    all_articles = models.Article.objects.filter(q, publish_status=True).order_by('-create_time')
    # all_articles = models.Article.objects.all().order_by('-create_time')
    page = Pagination(request, all_articles.count(), 5)
    all_articles = all_articles[page.start:page.end]
    return render(request, "home.html", locals())  # 样式自己找


from django.contrib.auth.decorators import login_required


@login_required
def set_pwd(request):
    if request.method == "POST":
        back_dic = {"code": 10000, "msg": ""}
        old_password = request.POST.get("old_password")
        # 判断原密码是否正确
        if request.user.check_password(old_password):
            new_password = request.POST.get("new_password")
            confirm_password = request.POST.get("confirm_password")
            # 判断两次密码是否一致
            if new_password == confirm_password:
                # 修改密码
                request.user.set_password(new_password)
                request.user.save()
                back_dic["msg"] = "修改成功"
                back_dic["url"] = reverse("login")
            else:
                back_dic["code"] = 10001
                back_dic["msg"] = "两次密码不一致"
        else:
            back_dic["code"] = 10002
            back_dic["msg"] = "原密码错误"
        return JsonResponse(back_dic)


@login_required
def logout(request):
    auth.logout(request)
    return redirect("home")


from django.db.models import Count
from django.db.models.functions import TruncMonth


def site(request, username, **kwargs):
    # 先校验当前用户名是否存在
    user_obj = models.UserInfo.objects.filter(username=username).first()
    if not user_obj:
        return render(request, "errors.html")
    blog = user_obj.blog
    article_list = models.Article.objects.filter(blog=blog, publish_status=True)
    """针对article_list筛选操作"""
    # 这里如何判断是否需要筛选 ——> 判断kwargs是否有值
    if kwargs:
        condition = kwargs.get("condition")
        param = kwargs.get("param")
        if condition == "category":
            article_list = article_list.filter(category_id=param)
        elif condition == "tag":
            article_list = article_list.filter(tag__pk=param)
        elif condition == "archive":
            year, month = param.split("-")
            article_list = article_list.filter(create_time__year=year, create_time__month=month)
        else:
            return render(request, "errors.html")
    q = get_query(request, ['title'])
    article_list = article_list.filter(q).order_by('-create_time')
    page = Pagination(request, article_list.count(), 5)
    article_list = article_list[page.start:page.end]
    return render(request, "site.html", locals())


def article(request, username, article_id):
    # 先校验当前用户名是否存在
    user_obj = models.UserInfo.objects.filter(username=username).first()
    if not user_obj:
        return render(request, "errors.html")
    article_obj = models.Article.objects.filter(pk=article_id).first()
    article_obj.view_num += 1
    article_obj.save()
    comment_list = models.Comment.objects.filter(article_id=article_id)
    return render(request, "article.html", locals())


def updown(request):
    """
    1.校验用户是否登录
    2.校验用户是否已经点过
    3.校验当前文章是否是当前用户的
    4.录入数据库
        操作两个库
    """
    if request.is_ajax():

        if request.method == "POST":
            back_dic = {"code": 10000, "msg": ""}
            # 1.校验用户是否登录
            if request.user.is_authenticated:
                article_id = request.POST.get("article_id")
                is_up = request.POST.get("is_up")
                # 针对字符串布尔值做类型转换,使用json.loads
                is_up = json.loads(is_up)
                article_obj = models.Article.objects.filter(pk=article_id).first()
                # 校验用户是否已经点过
                is_click = models.UpAndDown.objects.filter(article=article_obj, user=request.user)
                if not is_click:
                    # 校验当前文章是否是当前用户的
                    if not article_obj.blog.userinfo == request.user:
                        # 4.录入数据库 点赞点踩 文章表
                        if is_up:  # 赞+1
                            article_obj.up_num += 1
                            back_dic["msg"] = "点赞成功"
                        else:
                            article_id.down_num += 1
                            back_dic["msg"] = "点踩成功"
                        article_obj.save()
                        models.UpAndDown.objects.create(article=article_obj, user=request.user, is_up=is_up)
                    else:
                        back_dic["code"] = 10001
                        back_dic["msg"] = "不能给自己点！"
                else:
                    back_dic["code"] = 10002
                    back_dic["msg"] = "你已经点过了！"
            else:
                back_dic["code"] = 10003
                back_dic["msg"] = "请先<a href='/login/'>登录</a>"
            return JsonResponse(back_dic)


def comment(request):
    if request.is_ajax():
        if request.method == "POST":
            back_dic = {"code": 10000, "msg": ""}
            if request.user.is_authenticated:
                article_id = request.POST.get("article_id")
                content = request.POST.get("content")
                # 可以使用事务
                if content.strip() != "":
                    ret = models.Comment.objects.create(user=request.user, article_id=article_id, comment_msg=content)
                    # 文章表中普通字段
                    models.Article.objects.filter(pk=article_id).update(comment_num=F("comment_num") + 1)
                    back_dic["msg"] = "评论成功"
                    back_dic["ctime"] = arrow.now().format("YYYY-MM-DD HH:mm:ss")
                    back_dic["pk"] = ret.pk
                else:
                    back_dic["msg"] = "评论不合法"
                    back_dic["code"] = 10002
            else:
                back_dic["msg"] = "请先<a href='/login/'>登录</a>"
                back_dic["code"] = 10001
            return JsonResponse(back_dic)


def comment_reply(request):
    if request.is_ajax():
        if request.method == "POST":
            back_dic = {"code": 10000, "msg": ""}
            if request.user.is_authenticated:
                comment_id = request.POST.get("comment_id")
                reply = request.POST.get("reply")
                to_user = request.POST.get("to_user")
                if reply.strip() != "":
                    to_user_obj = models.UserInfo.objects.filter(username=to_user).first()
                    comment_obj = models.Comment.objects.filter(pk=comment_id).first()
                    ret = models.CommentReply.objects.create(comment_id=comment_id, reply_msg=reply,
                                                             to_user=to_user_obj,
                                                             user=request.user)
                    # 文章表中普通字段
                    models.Article.objects.filter(comment=comment_obj).update(comment_num=F("comment_num") + 1)
                    back_dic["msg"] = "评论成功"
                    back_dic["ctime"] = arrow.now().format("YYYY-MM-DD HH:mm:ss")
                    back_dic["pk"] = ret.pk
                else:
                    back_dic["msg"] = "评论不合法"
                    back_dic["code"] = 10002
            else:
                back_dic["msg"] = "请先登录"
                back_dic["code"] = 10001
            return JsonResponse(back_dic)


def comment_del(request):
    if request.is_ajax():
        if request.method == "POST":
            back_dic = {"code": 10000, "msg": ""}
            # 校验是否登录
            if request.user.is_authenticated:
                comment_id = request.POST.get("comment_id")
                # 判断是否是根评论
                if comment_id:
                    comment_obj = models.Comment.objects.filter(pk=comment_id, user=request.user).first()
                    # 校验是否是本人评论
                    if comment_obj:
                        models.Comment.objects.filter(pk=comment_id, user=request.user).delete()
                        back_dic["code"] = 11000
                        back_dic["msg"] = "删除根评论成功"
                    else:
                        back_dic["code"] = 10001
                        back_dic["msg"] = "该评论不是你的"
                else:
                    reply_id = request.POST.get("reply_id")
                    reply_obj = models.CommentReply.objects.filter(pk=reply_id, user=request.user).first()
                    if reply_obj:
                        models.CommentReply.objects.filter(pk=reply_id).delete()
                        back_dic["code"] = 12000
                        back_dic["msg"] = "删除子评论成功"
                    else:
                        back_dic["code"] = 10002
                        back_dic["msg"] = "该评论不是你的"
            else:
                back_dic["code"] = 10003
                back_dic["msg"] = "请先登录"
            return JsonResponse(back_dic)


@login_required
def backend(request):
    q = get_query(request, ['title'])
    all_articles = models.Article.objects.filter(q, blog=request.user.blog)
    page = Pagination(request, all_articles.count(), 5)
    all_articles = all_articles[page.start:page.end]
    return render(request, "backend/backend.html", locals())  # 样式自己找


# @login_required
# def article_add(request):
#     if request.method == "POST":
#         # 获取相应的数据
#         title = request.POST.get('title')
#         content = request.POST.get('content')
#         category_id = request.POST.get('category_id')
#         tag_list = request.POST.getlist('tag_list')
#         status = request.POST.get("publish_status")
#         # 将文本内容直接交给bs4模块
#         soup = BeautifulSoup(content, "html.parser")
#         # 将所有的script标签删除
#         for tag in soup.find_all():
#             # print(tag.name)  # 只获取标签名
#             if tag.name == 'script':
#                 tag.decompose()  # 删除script标签
#         # 文章简介 直接先采取 截取文章内容的方式
#         desc = soup.text[0:150]
#         # 录入数据  别忘了绑定个人站点
#         article_content_obj = models.Content.objects.create(content=str(soup))
#         article_obj = models.Article.objects.create(title=title, publish_status=status, desc=desc,
#                                                     content=article_content_obj,
#                                                     category_id=category_id, blog=request.user.blog)
#         # 文章与标签的第三张关系表
#         obj_list = []
#         for i in tag_list:
#             obj_list.append(models.ArticleToTag(article=article_obj, tag_id=i))
#         models.ArticleToTag.objects.bulk_create(obj_list)
#         # 跳转到后台管理
#         return redirect('backend')
#
#     category_list = models.Category.objects.filter(blog=request.user.blog)
#     tag_list = models.Tag.objects.filter(blog=request.user.blog)
#     return render(request, 'backend/article_add.html', locals())


@login_required
def article_add(request):
    # 将个人站点传入 在ArticleForm选取个人的分类和标签
    obj = models.Article(blog=request.user.blog)
    form_obj = ArticleForm(instance=obj)
    # 我的文章和文章详情分表了 没分表写一个就行了
    article_detail_form_obj = ArticleDetailForm()
    if request.method == 'POST':
        form_obj = ArticleForm(request.POST, instance=obj)
        article_detail_form_obj = ArticleDetailForm(request.POST)
        if form_obj.is_valid() and article_detail_form_obj.is_valid():
            detail_obj = article_detail_form_obj.save()
            form_obj.instance.desc = article_detail_form_obj.cleaned_data["desc"]
            form_obj.instance.content_id = detail_obj.pk  # 将文章详情中的id传入文章对象的cleaned_data中
            form_obj.save()
            url = request.GET.get('url')
            if url:
                return redirect(url)
            return redirect('backend')
    return render(request, 'backend/article_add.html', locals())


# 编辑文章
@login_required
def article_edit(request, pk):
    obj = models.Article.objects.filter(pk=pk).first()
    # form_obj = ArticleForm(request, instance=obj)
    form_obj = ArticleForm(instance=obj)
    article_detail_form_obj = ArticleDetailForm(instance=obj.content)
    if request.method == 'POST':
        form_obj = ArticleForm(request.POST, instance=obj)
        article_detail_form_obj = ArticleDetailForm(request.POST, instance=obj.content)
        if form_obj.is_valid() and article_detail_form_obj.is_valid():
            article_detail_form_obj.save()  # 保存文章详情
            form_obj.instance.desc = article_detail_form_obj.cleaned_data["desc"]
            form_obj.save()  # 保存文章信息
            url = request.GET.get('url')
            if url:
                return redirect(url)
            return redirect('backend')
    return render(request, 'backend/article_add.html', locals())


import os
from django.conf import settings


# def upload_img(request):
#     """
#     //成功时
#     {
#             "error" : 0,
#             "url" : "http://www.example.com/path/to/file.ext"
#     }
#     //失败时
#     {
#             "error" : 1,
#             "message" : "错误信息"
#     }
#
#     :param request:
#     :return:
#     """
#     # 接收图片数据并且保存到固定位置
#     if request.method == 'POST':
#         back_dic = {"error": 0, 'url': ''}
#         img_obj = request.FILES.get('imgFile')
#         path = os.path.join(settings.BASE_DIR, 'media', 'article', request.user.username)
#         if not os.path.exists(path):
#             os.mkdir(path)
#         file_path = os.path.join(path, img_obj.name)
#         with open(file_path, 'wb') as f:
#             for line in img_obj.chunks():
#                 f.write(line)
#         back_dic['url'] = '/media/article/%s/%s' % (request.user.username, img_obj.name)
#         print(back_dic)
#         return JsonResponse(back_dic)


@login_required
def all_list(request, name):
    cls = getattr(models, name.title())
    if not cls:
        return render(request,"errors.html")
    q = get_query(request, ['name', 'pk'])
    all_list = cls.objects.filter(q, blog=request.user.blog)

    page = Pagination(request, all_list.count(), 5)
    all_list = all_list[page.start:page.end]
    page_html = page.page_html
    title = "文章分类" if name == "category"  else  "文章标签" if name == "tag" else "摘抄"
    return render(request, 'backend/list.html', locals())


@login_required
def all_change(request, name, pk=None):
    cls = getattr(models, name.title())
    if not cls:
        return render(request, 'errors.html')
    obj = cls.objects.filter(pk=pk, blog=request.user.blog).first()  # pk=None ====> obj=None
    nameForm = name.title() + "Form"
    cls_form = getattr(forms, nameForm)
    form_obj = cls_form(instance=obj)  # instance 默认参数为None
    if request.method == 'POST':
        form_obj = cls_form(request.POST, instance=obj)
        if form_obj.is_valid():
            form_obj.instance.blog = request.user.blog
            form_obj.save()
            url = request.GET.get('url')
            if url:
                return redirect(url)
            return redirect('list', name)
    if pk:
        title = "编辑分类" if name == "category" else "编辑标签" if name == "tag" else "编辑摘抄"
    else:
        title = "添加分类" if name == "category" else "添加标签" if name == "tag" else "添加摘抄"
    return render(request, 'backend/change.html', locals())


@login_required
def all_delete(request, name):
    back_dic = {"code": 0, "msg": ""}
    if request.is_ajax():
        if request.method == "POST":
            pk = request.POST.get("pk")
            # 利用反射找到要删除的对象 进行删除
            cls = getattr(models, name.title())
            if not cls:
                return JsonResponse(back_dic)
            ret = cls.objects.filter(pk=pk)
            if ret:
                # 这里如果是文章表的话我是想删除文章详情表的对应的内容
                cid = None
                if hasattr(ret.first(),"content_id"):
                    cid = ret.first().content.id
                ret.delete()
                if cid:
                    # 不能在文章表之前删 models中可能需要重新设置下
                    models.Content.objects.filter(pk=cid).delete()
                back_dic["code"] = 200
    return JsonResponse(back_dic)


@login_required
def set_avatar(request):
    if request.method == 'POST':
        file_obj = request.FILES.get('avatar')
        user_obj = models.UserInfo.objects.filter(pk=request.user.pk).first()
        file_obj.name = user_obj.username + file_obj.name
        user_obj.avatar = file_obj
        user_obj.save()
        return redirect('backend')
    # return render(request, 'set_avatar.html', locals())
    return render(request, "backend/set_avatar.html")



# def test(request):
#     q = get_query(request, ['title'])
#     all_articles = models.Article.objects.filter(q, publish_status=True).order_by('-create_time')
#     # all_articles = models.Article.objects.all().order_by('-create_time')
#     page = Pagination(request, all_articles.count(), 5)
#     all_articles = all_articles[page.start:page.end]
#     return render(request, "test/../templates/index.html", locals())