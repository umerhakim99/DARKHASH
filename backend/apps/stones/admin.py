from django.contrib import admin
from .models import Category, Stone, StoneImage, Wishlist, PriceHistory


class StoneImageInline(admin.TabularInline):
    model = StoneImage
    extra = 1


class PriceHistoryInline(admin.TabularInline):
    model = PriceHistory
    extra = 0
    readonly_fields = ("timestamp",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Stone)
class StoneAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "weight",
        "origin",
        "stock",
        "is_featured",
        "is_active",
        "created_at",
    )
    list_filter = ("category", "origin", "is_featured", "is_active")
    search_fields = ("name", "origin", "color", "clarity")
    inlines = [StoneImageInline, PriceHistoryInline]

    def save_model(self, request, obj, form, change):
        old_price = None

        if change:
            old_obj = Stone.objects.filter(pk=obj.pk).first()
            if old_obj:
                old_price = old_obj.price

        super().save_model(request, obj, form, change)

        if not change or old_price != obj.price:
            PriceHistory.objects.create(stone=obj, price=obj.price)


@admin.register(StoneImage)
class StoneImageAdmin(admin.ModelAdmin):
    list_display = ("stone", "is_primary", "alt_text")


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ("user", "stone", "created_at")


@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = ("stone", "price", "timestamp")