# Generated by Django 3.2.2 on 2021-06-11 11:02

import ckeditor_uploader.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app01', '0006_auto_20210611_0750'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='content',
            field=ckeditor_uploader.fields.RichTextUploadingField(verbose_name='文章内容'),
        ),
    ]
