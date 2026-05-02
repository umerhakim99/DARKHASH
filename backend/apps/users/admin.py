from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "phone",
        "city",
        "province",
        "country",
        "postal_code",
    )
    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
        "phone",
        "city",
        "province",
        "postal_code",
    )
    list_filter = ("province", "city", "country")