from rest_framework import viewsets, permissions, generics
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

from apps.core.permissions import IsAdminOrReadOnly
from .models import Category, Stone, StoneImage, Wishlist, PriceHistory
from .serializers import (
    CategorySerializer,
    StoneSerializer,
    StoneImageUploadSerializer,
    WishlistSerializer,
    PriceHistorySerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class StoneViewSet(viewsets.ModelViewSet):
    queryset = (
        Stone.objects.filter(is_active=True)
        .select_related("category")
        .prefetch_related("images", "price_history", "reviews")
    )
    serializer_class = StoneSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    filterset_fields = [
        "category",
        "origin",
        "color",
        "clarity",
        "is_featured",
    ]
    search_fields = ["name", "description", "origin", "color", "clarity"]
    ordering_fields = ["price", "weight", "created_at"]
    ordering = ["-created_at"]

    def perform_create(self, serializer):
        stone = serializer.save()
        PriceHistory.objects.create(stone=stone, price=stone.price)

    def perform_update(self, serializer):
        old_price = None

        if serializer.instance:
            old_price = serializer.instance.price

        stone = serializer.save()

        if old_price != stone.price:
            PriceHistory.objects.create(stone=stone, price=stone.price)


class StoneImageUploadView(generics.CreateAPIView):
    queryset = StoneImage.objects.all()
    serializer_class = StoneImageUploadSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAdminUser]


class WishlistView(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Wishlist.objects.filter(user=self.request.user)
            .select_related("stone", "stone__category")
            .prefetch_related("stone__images")
        )


class WishlistToggleView(generics.GenericAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        stone_id = request.data.get("stone")

        if not stone_id:
            return Response({"detail": "stone is required."}, status=400)

        wishlist_item, created = Wishlist.objects.get_or_create(
            user=request.user,
            stone_id=stone_id,
        )

        if not created:
            wishlist_item.delete()
            return Response(
                {
                    "detail": "Removed from wishlist.",
                    "wishlisted": False,
                }
            )

        return Response(
            {
                "detail": "Added to wishlist.",
                "wishlisted": True,
            }
        )


class StonePriceHistoryView(generics.ListAPIView):
    serializer_class = PriceHistorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        stone_id = self.kwargs["stone_id"]
        return PriceHistory.objects.filter(stone_id=stone_id)