from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id",
            "user",
            "username",
            "full_name",
            "stone",
            "rating",
            "comment",
            "created_at",
        ]
        read_only_fields = ["user"]

    def get_full_name(self, obj):
        full_name = obj.user.get_full_name()
        return full_name if full_name else obj.user.username

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value