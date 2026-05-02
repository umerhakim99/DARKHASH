from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

from .models import UserProfile
from apps.orders.serializers import (
    validate_pakistan_phone,
    validate_postal_code,
    validate_manual_address,
)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    first_name = serializers.CharField(max_length=80)
    last_name = serializers.CharField(max_length=80)
    email = serializers.EmailField(required=True)

    phone = serializers.CharField(max_length=20, write_only=True)

    address_line_1 = serializers.CharField(max_length=255, write_only=True)
    address_line_2 = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        write_only=True,
    )

    city = serializers.CharField(max_length=100, write_only=True)
    province = serializers.CharField(max_length=100, write_only=True)
    country = serializers.CharField(max_length=100, default="Pakistan", write_only=True)
    postal_code = serializers.CharField(max_length=20, write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "password",
            "phone",
            "address_line_1",
            "address_line_2",
            "city",
            "province",
            "country",
            "postal_code",
        ]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_phone(self, value):
        return validate_pakistan_phone(value)

    def validate_postal_code(self, value):
        return validate_postal_code(value)

    def validate(self, attrs):
        if attrs.get("country") != "Pakistan":
            raise serializers.ValidationError(
                {"country": "Currently we support Pakistan addresses only."}
            )

        validate_manual_address(
            city=attrs.get("city"),
            province=attrs.get("province"),
            postal_code=attrs.get("postal_code"),
        )

        return attrs

    def create(self, validated_data):
        profile_data = {
            "phone": validated_data.pop("phone"),
            "address_line_1": validated_data.pop("address_line_1"),
            "address_line_2": validated_data.pop("address_line_2", ""),
            "city": validated_data.pop("city"),
            "province": validated_data.pop("province"),
            "country": validated_data.pop("country", "Pakistan"),
            "postal_code": validated_data.pop("postal_code"),
        }

        email = validated_data["email"]
        username = email.split("@")[0]

        base_username = username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )

        UserProfile.objects.create(user=user, **profile_data)

        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise AuthenticationFailed("Email and password are required.")

        user = User.objects.filter(email__iexact=email).first()

        if user is None:
            raise AuthenticationFailed("No account found with this email.")

        authenticated_user = authenticate(
            request=self.context.get("request"),
            username=user.username,
            password=password,
        )

        if authenticated_user is None:
            raise AuthenticationFailed("Invalid email or password.")

        if not authenticated_user.is_active:
            raise AuthenticationFailed("This account is disabled.")

        profile = getattr(authenticated_user, "profile", None)

        refresh = self.get_token(authenticated_user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": authenticated_user.id,
                "username": authenticated_user.username,
                "first_name": authenticated_user.first_name,
                "last_name": authenticated_user.last_name,
                "full_name": authenticated_user.get_full_name(),
                "email": authenticated_user.email,
                "is_staff": authenticated_user.is_staff,
                "is_superuser": authenticated_user.is_superuser,
                "phone": profile.phone if profile else "",
                "address_line_1": profile.address_line_1 if profile else "",
                "address_line_2": profile.address_line_2 if profile else "",
                "city": profile.city if profile else "",
                "province": profile.province if profile else "",
                "country": profile.country if profile else "Pakistan",
                "postal_code": profile.postal_code if profile else "",
            },
        }


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    address_line_1 = serializers.SerializerMethodField()
    address_line_2 = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    province = serializers.SerializerMethodField()
    country = serializers.SerializerMethodField()
    postal_code = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "is_staff",
            "is_superuser",
            "phone",
            "address_line_1",
            "address_line_2",
            "city",
            "province",
            "country",
            "postal_code",
        ]

    def get_full_name(self, obj):
        return obj.get_full_name()

    def get_profile_value(self, obj, field, default=""):
        profile = getattr(obj, "profile", None)

        if not profile:
            return default

        return getattr(profile, field, default)

    def get_phone(self, obj):
        return self.get_profile_value(obj, "phone")

    def get_address_line_1(self, obj):
        return self.get_profile_value(obj, "address_line_1")

    def get_address_line_2(self, obj):
        return self.get_profile_value(obj, "address_line_2")

    def get_city(self, obj):
        return self.get_profile_value(obj, "city")

    def get_province(self, obj):
        return self.get_profile_value(obj, "province")

    def get_country(self, obj):
        return self.get_profile_value(obj, "country", "Pakistan")

    def get_postal_code(self, obj):
        return self.get_profile_value(obj, "postal_code")