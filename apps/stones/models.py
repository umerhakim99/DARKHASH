from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Stone(models.Model):
    name = models.CharField(max_length=180)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="stones"
    )
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    weight = models.DecimalField(max_digits=8, decimal_places=2, help_text="Weight in carats")
    color = models.CharField(max_length=80)
    clarity = models.CharField(max_length=80)
    origin = models.CharField(max_length=120)
    certification_file = models.FileField(
        upload_to="certifications/",
        blank=True,
        null=True
    )
    stock = models.PositiveIntegerField(default=1)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class StoneImage(models.Model):
    stone = models.ForeignKey(
        Stone,
        on_delete=models.CASCADE,
        related_name="images"
    )
    image = models.ImageField(upload_to="stones/")
    alt_text = models.CharField(max_length=180, blank=True)
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.stone.name}"


class Wishlist(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wishlist_items"
    )
    stone = models.ForeignKey(
        Stone,
        on_delete=models.CASCADE,
        related_name="wishlisted_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "stone")

    def __str__(self):
        return f"{self.user} - {self.stone}"


class PriceHistory(models.Model):
    stone = models.ForeignKey(
        Stone,
        on_delete=models.CASCADE,
        related_name="price_history"
    )
    price = models.DecimalField(max_digits=12, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"{self.stone.name} - {self.price}"