from rest_framework import generics, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Stone, StoneImage, PriceHistory
from .serializers import CategorySerializer, StoneSerializer, PriceHistorySerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Anyone can view.
    Only admin users can create, update, or delete.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return bool(request.user and request.user.is_staff)


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class StoneListCreateView(generics.ListCreateAPIView):
    serializer_class = StoneSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = Stone.objects.all().order_by("-created_at")

        category = self.request.query_params.get("category")
        stone_type = self.request.query_params.get("type")
        origin = self.request.query_params.get("origin")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        search = self.request.query_params.get("search")

        if category:
            queryset = queryset.filter(category_id=category)

        if stone_type:
            queryset = queryset.filter(category__name__icontains=stone_type)

        if origin:
            queryset = queryset.filter(origin__icontains=origin)

        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset


class StoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Stone.objects.all()
    serializer_class = StoneSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]


class PriceHistoryListView(generics.ListAPIView):
    serializer_class = PriceHistorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        stone_id = self.kwargs.get("stone_id")
        return PriceHistory.objects.filter(stone_id=stone_id).order_by("timestamp")


class StoneImageUploadView(APIView):
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        stone_id = request.data.get("stone")
        image = request.FILES.get("image")
        alt_text = request.data.get("alt_text", "")

        if not stone_id:
            return Response(
                {"stone": "Stone id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not image:
            return Response(
                {"image": "Image file is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            stone = Stone.objects.get(id=stone_id)
        except Stone.DoesNotExist:
            return Response(
                {"stone": "Stone not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        stone_image = StoneImage.objects.create(
            stone=stone,
            image=image,
            alt_text=alt_text or stone.name,
        )

        return Response(
            {
                "id": stone_image.id,
                "stone": stone.id,
                "image": request.build_absolute_uri(stone_image.image.url),
                "alt_text": stone_image.alt_text,
            },
            status=status.HTTP_201_CREATED,
        )


class StoneImageDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, pk):
        try:
            stone_image = StoneImage.objects.get(id=pk)
        except StoneImage.DoesNotExist:
            return Response(
                {"detail": "Image not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if stone_image.image:
            stone_image.image.delete(save=False)

        stone_image.delete()

        return Response(
            {"detail": "Image deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )