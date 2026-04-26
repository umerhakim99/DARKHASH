from django.conf import settings
from django.db import models
from apps.stones.models import Stone


class Review(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    stone = models.ForeignKey(
        Stone,
        on_delete=models.CASCADE,
        related_name="reviews"
    )
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "stone")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.stone.name} - {self.rating}/5"