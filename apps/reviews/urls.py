from django.urls import path
from .views import ReviewCreateView, StoneReviewListView


urlpatterns = [
    path("reviews/", ReviewCreateView.as_view(), name="review-create"),
    path("reviews/<int:stone_id>/", StoneReviewListView.as_view(), name="stone-reviews"),
]