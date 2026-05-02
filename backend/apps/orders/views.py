from django.db import transaction
from rest_framework import generics, permissions
from rest_framework.response import Response

from apps.stones.models import Stone
from .models import Cart, CartItem, Order, OrderItem
from .serializers import (
    CartSerializer,
    AddToCartSerializer,
    RemoveFromCartSerializer,
    OrderSerializer,
    CreateOrderSerializer,
    AdminOrderUpdateSerializer,
)


class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart


class AddToCartView(generics.GenericAPIView):
    serializer_class = AddToCartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        stone_id = serializer.validated_data["stone_id"]
        quantity = serializer.validated_data["quantity"]

        try:
            stone = Stone.objects.get(id=stone_id, is_active=True)
        except Stone.DoesNotExist:
            return Response({"detail": "Stone not found."}, status=404)

        if stone.stock < quantity:
            return Response({"detail": "Not enough stock available."}, status=400)

        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            stone=stone,
            defaults={"quantity": quantity},
        )

        if not created:
            new_quantity = cart_item.quantity + quantity

            if stone.stock < new_quantity:
                return Response({"detail": "Not enough stock available."}, status=400)

            cart_item.quantity = new_quantity
            cart_item.save()

        return Response(CartSerializer(cart).data)


class RemoveFromCartView(generics.GenericAPIView):
    serializer_class = RemoveFromCartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        stone_id = serializer.validated_data["stone_id"]

        cart, _ = Cart.objects.get_or_create(user=request.user)
        CartItem.objects.filter(cart=cart, stone_id=stone_id).delete()

        return Response(CartSerializer(cart).data)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().select_related("user").prefetch_related("items", "items__stone")

        return (
            Order.objects.filter(user=self.request.user)
            .select_related("user")
            .prefetch_related("items", "items__stone")
        )


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().select_related("user").prefetch_related("items", "items__stone")

        return (
            Order.objects.filter(user=self.request.user)
            .select_related("user")
            .prefetch_related("items", "items__stone")
        )


class CreateOrderView(generics.GenericAPIView):
    serializer_class = CreateOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_items = cart.items.select_related("stone")

        if not cart_items.exists():
            return Response({"detail": "Cart is empty."}, status=400)

        total_price = sum(item.total_price for item in cart_items)

        order = Order.objects.create(
            user=request.user,
            total_price=total_price,
            **serializer.validated_data,
        )

        for item in cart_items:
            stone = item.stone

            if stone.stock < item.quantity:
                return Response(
                    {"detail": f"Not enough stock for {stone.name}."},
                    status=400,
                )

            OrderItem.objects.create(
                order=order,
                stone=stone,
                quantity=item.quantity,
                price=stone.price,
            )

            stone.stock -= item.quantity
            stone.save()

        cart_items.delete()

        return Response(OrderSerializer(order).data, status=201)


class AdminOrderUpdateView(generics.UpdateAPIView):
    serializer_class = AdminOrderUpdateSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Order.objects.all()