from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.core.views import frontend


urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("api/", include("apps.users.urls")),
    path("api/", include("apps.stones.urls")),
    path("api/", include("apps.orders.urls")),
    path("api/", include("apps.reviews.urls")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns += [
    re_path(r"^(?!api/|admin/|media/|static/).*?$", frontend, name="frontend"),
]