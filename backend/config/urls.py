from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin

from django.urls import (
    include,
    path,
)


urlpatterns = [

    path(
        'admin/',
        admin.site.urls
    ),

    path(
        'api/',
        include('accounts.urls')
    ),

    path(
        'api/fish/',
        include('fish.urls')
    ),

    path(
        'api/pond/',
        include('pond.urls')
    ),

    path(
        'api/product/',
        include('product.urls')
    ),

]


if settings.DEBUG:

    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )