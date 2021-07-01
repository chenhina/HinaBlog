from bs4 import BeautifulSoup
from django import forms
from app01 import models
from django.core.exceptions import ValidationError


class BSForm(forms.ModelForm):
    """
    拥有bootstrap样式
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # 自定义操作
        # 给每个标签添加样式 除了 tag 标签不需要。。。。。
        for field in self.fields.values():
            # if field.label != "标签":
            field.widget.attrs['class'] = 'form-control'
        self.field_order = True  # 按照给定的字段顺序展示


# 注册forms组件
class MyRegister(BSForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'type': 'password', 'placeholder': '密码'}), label='密码',
                               error_messages={'required': '密码不能为空'})
    confirm_password = forms.CharField(widget=forms.PasswordInput(attrs={'type': 'password', 'placeholder': '确认密码'}),
                                       label='确认密码', error_messages={'required': '确认密码不能为空'})

    # 邮箱
    email = forms.EmailField(
        label="邮箱",
        error_messages={
            "invalid": "邮箱格式错误",
            "required": "邮箱不能为空",
        },
        widget=forms.widgets.EmailInput(attrs={"class": "form-control", 'placeholder': '邮箱'})
    )

    class Meta:
        model = models.UserInfo
        fields = ["username", "password", "confirm_password", "email"]
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': '用户名', 'autocomplete': 'off'}),
            # "email": forms.widgets.EmailInput(attrs={"placeholder": "邮箱"})
        }
        error_messages = {
            'username': {
                'required': '用户名不能为空',
            },
            # 'email': {
            #     'required': '邮箱不能为空',
                #     "invalid": "邮箱格式错误",
            # },
        }

    # 钩子函数
    # 局部钩子 校验用户名是否存在
    # 可以在全局钩子定义self._validate_unique = True 来校验数据唯一性
    # def clean_username(self):
    #     username = self.cleaned_data.get("username")
    #     res = models.UserInfo.objects.filter(username=username).first()
    #     if res:
    #         self.add_error("username", "用户名已存在")
    #     return username

    def clean(self):
        self._validate_unique = True
        password = self.cleaned_data.get("password")
        confirm_password = self.cleaned_data.get("confirm_password")
        if not password == confirm_password:
            self.add_error("confirm_password", "两次密码不一致")

        return self.cleaned_data

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class ArticleForm(BSForm):
    # 这里是为了将复选框改写为复选按钮,重写tag对象  (只能转化成ul>li列表的形式,无法横着直接input框的形式展现)
    # tag = forms.MultipleChoiceField(
    #     choices=(),
    #     label="标签",
    #     widget=forms.widgets.CheckboxSelectMultiple(attrs={"class": "checkbox-inline"})
    # )

    class Meta:
        model = models.Article
        # 需要显示在前端的字段
        fields = ["title", "publish_status", "category","tag"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # print(models.Tag.objects.filter(blog=self.instance.blog).values_list('id', 'name'))
        # 绑定个人站点对应的分类和标签,需要在试图函数中将个人站点的信息传入到instance对象中
        # obj = models.Article(blog=request.user.blog)
        # form_obj = ArticleForm(instance=obj)
        self.fields['tag'].choices = models.Tag.objects.filter(blog=self.instance.blog).values_list('id', 'name')
        self.fields['category'].choices = models.Category.objects.filter(blog=self.instance.blog).values_list('id',
                                                                                                              'name')
        self.fields['category'].choices.insert(0, ('', "--------"))  # 给分类一个默选项


class ArticleDetailForm(forms.ModelForm):
    class Meta:
        model = models.Content
        fields = '__all__'

    # 全局钩子 验证文章详情是否合法 可以将xss攻击的校验放到这里
    def clean(self):
        content = self.cleaned_data.get("content")
        soup = BeautifulSoup(content, "html.parser")
        for tag in soup.find_all():
            # print(tag.name)  # 只获取标签名
            if tag.name == 'script':
                tag.decompose()  # 删除script标签
            # 文章简介 直接先采取 截取文章内容的方式
        if str(soup) != "":
            self.cleaned_data["content"] = str(soup)
            self.cleaned_data["desc"] = soup.text[0:150]
            return self.cleaned_data
        else:
            self.add_error("content", "你不能这么做！")
            raise ValidationError('你不能这么做！')


class CategoryForm(BSForm):
    class Meta:
        model = models.Category
        fields = ["name"]




class TagForm(BSForm):
    class Meta:
        model = models.Tag
        fields = ["name"]

class VerseForm(BSForm):
    class Meta:
        model = models.Verse
        fields = ["name"]