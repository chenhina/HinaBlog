from __future__ import absolute_import

from django.conf.urls import url
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.cache import never_cache

from ckeditor_uploader import views



# urlpatterns = [
#     url(r'^upload/', staff_member_required(views.upload), name='ckeditor_upload'),
#     url(r'^browse/', never_cache(staff_member_required(views.browse)), name='ckeditor_browse'),
# ]


urlpatterns = [
    url(r"^upload/", views.upload, name="ckeditor_upload"),
    url(
        r"^browse/",
        never_cache(views.browse),
        name="ckeditor_browse",
    ),
]
