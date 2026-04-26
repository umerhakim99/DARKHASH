from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    StoneViewSet,
    StoneImageUploadView,
    WishlistView,
    WishlistToggleView,
    StonePriceHistoryView,
)


router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="categories")
router.register("stones", StoneViewSet, basename="stones")


urlpatterns = [
    path("", include(router.urls)),
    path("stone-images/upload/", StoneImageUploadView.as_view(), name="stone-image-upload"),
    path("wishlist/", WishlistView.as_view(), name="wishlist"),
    path("wishlist/toggle/", WishlistToggleView.as_view(), name="wishlist-toggle"),
    path("stones/<int:stone_id>/price-history/", StonePriceHistoryView.as_view(), name="price-history"),
]