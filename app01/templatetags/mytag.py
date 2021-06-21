from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.http.request import QueryDict
from django.template import Library
from django.shortcuts import reverse
import random
from app01 import models

register = Library()


@register.inclusion_tag("menu.html")
def menu(username):
    # 获取当前用户所有的分类名称以及分类下的文章数
    user_obj = models.UserInfo.objects.filter(username=username).first()
    blog = user_obj.blog
    category_list = models.Category.objects.filter(blog=blog,article__publish_status=True).annotate(article_num=Count("article")).values("name",
                                                                                                            "article_num",
                                                                                                            "pk")

    # 获取当前用户所有的标签及标签下的文章数
    tag_list = models.Tag.objects.filter(blog=blog,article__publish_status=True).annotate(article_num=Count("article")).values("name", "article_num",
                                                                                                  "pk")

    # 按照年月对文章进行分组
    data_list = models.Article.objects.filter(blog=blog,publish_status=True).annotate(month=TruncMonth("create_time")).values(
        "month").annotate(article_num=Count("pk")).values("month", "article_num")

    return locals()


@register.inclusion_tag("verse.html")
def verse():
    ver_list = models.Verse.objects.all()
    ver_obj = random.choice(ver_list)
    return locals()


@register.simple_tag
def reverse_url(request, name, *args, **kwargs):
    qd = QueryDict(mutable=True)

    url = request.get_full_path()

    qd['url'] = url
    return f"{reverse(name, args=args, kwargs=kwargs)}?{qd.urlencode()}"