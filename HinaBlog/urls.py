"""HinaBlog URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from app01 import views
from django.views.static import serve
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    # path("test/",views.test,name="test"),
    # 注册
    path("register/", views.register, name="register"),
    # 登录
    path("login/", views.login, name="login"),
    path("get_code/", views.get_code, name="get_code"),

    # 首页
    path("", views.home, name="home"),
    # 修改密码
    path("set_pwd/", views.set_pwd, name="set_pwd"),
    # 注销
    path("logout/", views.logout, name="logout"),
    # 点赞点踩
    path("updown/", views.updown, name="updown"),
    # 评论
    path("comment/", views.comment, name="comment"),
    path("comment_reply/", views.comment_reply, name="comment_reply"),
    path("comment_del/", views.comment_del, name="comment_del"),

    # 后台管理
    re_path("backend/(?P<condition>category|tag)/(?P<pk>\d+)/", views.backend, name="backend_b"),
    path("backend/", views.backend, name="backend"),

    # 添加文章
    path("article_add/", views.article_add, name="article_add"),
    # 编辑文章
    re_path("article_edit/(\d+)", views.article_edit, name="article_edit"),
    # path("article_del/", views.article_del, name="article_del"),
    # 展示分类/标签
    re_path("^(category|tag|verse)/", views.all_list, name="list"),
    # 添加标签/分类
    re_path('^(category|tag|verse)_add/', views.all_change, name='add'),
    # 修改标签/分类
    re_path(r'^(category|tag|verse)_edit/(\d+)', views.all_change, name='edit'),
    # 删除三合一
    re_path(r'^(category|article|tag|verse)_del/', views.all_delete, name='del'),

    # path(r'upload_img/', views.upload_img, name='upload_img'),
    # 修改头像
    path(r'set_avatar/', views.set_avatar, name='set_avatar'),
    # 暴露指定的后端资源
    re_path(r"^media/(?P<path>.*)", serve, {"document_root": settings.MEDIA_ROOT}),

    # re_path(r"^(?P<username>\w+)/category/(?P<category_id>\d+)/",views.site),
    # re_path(r"^(?P<username>\w+)/tag/(?P<tag_id>\d+)/",views.site),
    # re_path(r"^(?P<username>\w+)/archive/(?P<time>.*)/",views.site),
    # 上述三条可以合并为一条
    re_path(r"^(?P<username>\w+)/(?P<condition>category|tag|archive)/(?P<param>.*)/", views.site, name="blog"),
    # 个人站点页
    re_path(r"^(?P<username>\w+)/$", views.site, name="site"),
    # 文章详情
    # 侧边栏筛选功能
    re_path("^(?P<username>\w+)/article/(?P<article_id>\d+)", views.article, name="article"),

    path(r"ckeditor/", include("app01.ckeditor_urls")),
]

"""
media相当于STATIC_URL = '/static/' 功能
接口前缀

路由书写的时候，由于第一个参数时正则表达式 当路由特比多的情况下极有可能出现顶替的情况
    解决措施
        1.仔细改写正则匹配
        2.换位置
"""
