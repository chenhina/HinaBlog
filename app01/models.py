from django.db import models
# Create your models here.
from ckeditor_uploader.fields import RichTextUploadingField
from django.contrib.auth.models import AbstractUser
from django.utils.safestring import mark_safe


class UserInfo(AbstractUser):
    """用户表"""
    phone = models.BigIntegerField(verbose_name="手机号", null=True, blank=True)  # blank针对后台管理表示可以为空
    # 用户头像  存储头像路径  图片数据单独存放  upload_to指定文件存放路径
    avatar = models.FileField(verbose_name="头像", upload_to="avatar/", default="avatar/default.jpg")
    # 日期
    create_time = models.DateTimeField("注册时间", auto_now_add=True)

    blog = models.OneToOneField(to="Site", null=True, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "用户表"

    def __str__(self):
        return self.username


class Site(models.Model):
    """个人站点"""
    site_title = models.CharField("站点标题", max_length=32, null=True)
    site_name = models.CharField("站点名称", max_length=32, null=True)
    site_theme = models.CharField("站点样式", max_length=32, null=True)

    def __str__(self):
        return self.site_name

    class Meta:
        verbose_name_plural = "个人站点表"


class Article(models.Model):
    """文章表"""
    title = models.CharField("文章标题", max_length=128)
    desc = models.CharField("文章简介", max_length=255)

    create_time = models.DateTimeField("创建时间", auto_now_add=True)
    # 是否发布
    publish_status = models.BooleanField(default=False, choices=((False, '未发布'), (True, '发布')), verbose_name='发布状态')

    # 评论数 点赞数 点踩数  字段优化 避免频繁跨表浪费资源
    # 定义三个普通字段记录
    comment_num = models.IntegerField("评论数", default=0)
    view_num = models.IntegerField("阅读数", default=0)
    up_num = models.IntegerField("点赞数", default=0)
    down_num = models.IntegerField("点踩数", default=0)

    # 当评论表或者点赞、点踩表有记录的时候 顺带修改上述三个普通字段即可

    # 个人站点
    content = models.OneToOneField(to="Content", on_delete=models.DO_NOTHING)
    blog = models.ForeignKey(to="Site", null=True, on_delete=models.DO_NOTHING)
    # 分类
    category = models.ForeignKey(to="Category", null=True, blank=True, on_delete=models.CASCADE, verbose_name="分类")
    # 标签
    tag = models.ManyToManyField(to="Tag", blank=True, through="ArticleToTag", through_fields=("article", "tag"),
                                 verbose_name="标签")

    def __str__(self):
        return self.title

    def show_publish_status(self):
        color_dic = {
            True: '#1dc5a3',
            False: 'deeppink',
        }

        return mark_safe(f'<span style="background: {color_dic[self.publish_status]}; color: whitesmoke; padding: '
                         f'2px">{self.get_publish_status_display()}</span>')

    class Meta:
        verbose_name_plural = "文章表"


class Content(models.Model):
    content = RichTextUploadingField(verbose_name='文章内容')

    class Meta:
        verbose_name_plural = "文章详情表"


class Tag(models.Model):
    """标签表"""
    name = models.CharField("文章标签", max_length=32)
    blog = models.ForeignKey(to="Site", null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "标签表"


class ArticleToTag(models.Model):
    article = models.ForeignKey(to="Article", on_delete=models.CASCADE)
    tag = models.ForeignKey(to="Tag", on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "文章标签关系表"


class Category(models.Model):
    """分类表"""
    name = models.CharField("文章分类", max_length=32)
    blog = models.ForeignKey(to="Site", null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "分类表"


class UpAndDown(models.Model):
    """点赞点踩"""
    user = models.ForeignKey(to="UserInfo", on_delete=models.CASCADE)
    article = models.ForeignKey(to="Article", on_delete=models.CASCADE)
    is_up = models.BooleanField("点赞点踩")  # True/False 1/0

    def __str__(self):
        return self.user

    class Meta:
        verbose_name_plural = "点赞点踩表"


class Comment(models.Model):
    """评论表"""
    user = models.ForeignKey(to="UserInfo", on_delete=models.CASCADE)
    article = models.ForeignKey(to="Article", on_delete=models.CASCADE)

    comment_msg = models.CharField("评论内容", max_length=255)
    comment_time = models.DateTimeField("评论日期", auto_now_add=True)

    # 自关联
    # parent = models.ForeignKey(to="self",null=True,on_delete=models.CASCADE)
    def __str__(self):
        return self.user

    class Meta:
        verbose_name_plural = "评论表"


class CommentReply(models.Model):
    """评论回复表"""
    user = models.ForeignKey(to="UserInfo", on_delete=models.CASCADE, related_name="from_user")
    comment = models.ForeignKey(to="Comment", on_delete=models.CASCADE)
    reply_msg = models.CharField("回复内容", max_length=255)
    reply_time = models.DateTimeField("回复日期", auto_now_add=True)
    to_user = models.ForeignKey(to="UserInfo", on_delete=models.CASCADE, related_name="to_user")

    def __str__(self):
        return self.user

    class Meta:
        verbose_name_plural = "评论回复表"


class Verse(models.Model):
    name = models.CharField(max_length=64)
    blog = models.ForeignKey(to="Site", null=True, on_delete=models.CASCADE)

