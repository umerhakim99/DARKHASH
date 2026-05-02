from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class StoneReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        stone_id = self.kwargs["stone_id"]
        return Review.objects.filter(stone_id=stone_id).select_related("user")