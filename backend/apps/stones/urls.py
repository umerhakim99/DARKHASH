from django.urls import path

from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    StoneListCreateView,
    StoneDetailView,
    PriceHistoryListView,
    StoneImageUploadView,
    StoneImageDetailView,
)

urlpatterns = [
    path("categories/", CategoryListCreateView.as_view(), name="category-list-create"),
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),

    path("stones/", StoneListCreateView.as_view(), name="stone-list-create"),
    path("stones/<int:pk>/", StoneDetailView.as_view(), name="stone-detail"),

    path(
        "stones/<int:stone_id>/price-history/",
        PriceHistoryListView.as_view(),
        name="price-history",
    ),

    path("stone-images/", StoneImageUploadView.as_view(), name="stone-image-upload"),
    path(
        "stone-images/<int:pk>/",
        StoneImageDetailView.as_view(),
        name="stone-image-detail",
    ),
]