# Generated by Django 3.2.2 on 2021-06-07 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app01', '0003_auto_20210604_1926'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='view_num',
            field=models.IntegerField(default=0, verbose_name='阅读数'),
        ),
    ]
