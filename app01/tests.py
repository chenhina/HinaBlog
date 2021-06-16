import arrow

from django.test import TestCase

# Create your tests here.

import os
import sys



os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HinaBlog.settings')
import django
django.setup()
from app01 import models

obj = models.Article.objects.filter(pk=1).first()

print(obj.tag.values_list("id").all())



