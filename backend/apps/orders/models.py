from django.conf import settings
from django.db import models
from apps.stones.models import Stone


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart - {self.user}"

    @property
    def total_price(self):
        return sum(item.total_price for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
    )
    stone = models.ForeignKey(
        Stone,
        on_delete=models.CASCADE,
        related_name="cart_items",
    )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("cart", "stone")

    def __str__(self):
        return f"{self.stone.name} x {self.quantity}"

    @property
    def total_price(self):
        return self.stone.price * self.quantity


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        PROCESSING = "processing", "Processing"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"

    class PaymentMethod(models.TextChoices):
        CASH_ON_DELIVERY = "cash_on_delivery", "Cash on Delivery"
        BANK_TRANSFER = "bank_transfer", "Bank Transfer"

    class PaymentStatus(models.TextChoices):
        UNPAID = "unpaid", "Unpaid"
        PAID = "paid", "Paid"
        REFUNDED = "refunded", "Refunded"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders",
    )

    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.PENDING,
    )

    payment_method = models.CharField(
        max_length=40,
        choices=PaymentMethod.choices,
        default=PaymentMethod.CASH_ON_DELIVERY,
    )

    payment_status = models.CharField(
        max_length=30,
        choices=PaymentStatus.choices,
        default=PaymentStatus.UNPAID,
    )

    full_name = models.CharField(max_length=160)
    email = models.EmailField()
    phone = models.CharField(max_length=40)

    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True)

    city = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default="Pakistan")
    postal_code = models.CharField(max_length=30)

    google_place_id = models.CharField(max_length=255, blank=True)
    formatted_address = models.TextField(blank=True)
    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True,
    )
    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7,
        null=True,
        blank=True,
    )

    customer_note = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.id} - {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )
    stone = models.ForeignKey(
        Stone,
        on_delete=models.PROTECT,
        related_name="order_items",
    )
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.stone.name} x {self.quantity}"