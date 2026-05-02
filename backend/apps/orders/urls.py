from django.urls import path
from .views import (
    CartView,
    AddToCartView,
    RemoveFromCartView,
    OrderListView,
    OrderDetailView,
    CreateOrderView,
    AdminOrderUpdateView,
)


urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/add/", AddToCartView.as_view(), name="cart-add"),
    path("cart/remove/", RemoveFromCartView.as_view(), name="cart-remove"),

    path("orders/", OrderListView.as_view(), name="orders"),
    path("orders/create/", CreateOrderView.as_view(), name="orders-create"),
    path("orders/<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
    path("admin/orders/<int:pk>/update/", AdminOrderUpdateView.as_view(), name="admin-order-update"),
]