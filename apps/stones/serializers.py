from rest_framework import serializers
from .models import Category, Stone, StoneImage, Wishlist, PriceHistory


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description"]


class StoneImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoneImage
        fields = ["id", "image", "alt_text", "is_primary"]


class PriceHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceHistory
        fields = ["id", "price", "timestamp"]


class StoneSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source="category", read_only=True)
    images = StoneImageSerializer(many=True, read_only=True)
    price_history = PriceHistorySerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Stone
        fields = [
            "id",
            "name",
            "category",
            "category_detail",
            "description",
            "price",
            "weight",
            "color",
            "clarity",
            "origin",
            "certification_file",
            "stock",
            "is_featured",
            "is_active",
            "created_at",
            "images",
            "price_history",
            "average_rating",
        ]

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return 0
        return round(sum(review.rating for review in reviews) / reviews.count(), 1)


class StoneImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoneImage
        fields = ["id", "stone", "image", "alt_text", "is_primary"]


class WishlistSerializer(serializers.ModelSerializer):
    stone_detail = StoneSerializer(source="stone", read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "stone", "stone_detail", "created_at"]