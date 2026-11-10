
from rest_framework import serializers

from .models import Order, OrderItem


class CheckoutSerializer(serializers.Serializer):

    full_name = serializers.CharField(
        max_length=150
    )

    phone_number = serializers.CharField(
        max_length=20
    )

    shipping_address = serializers.CharField()

    payment_method = serializers.ChoiceField(
        choices=Order.PAYMENT_METHOD_CHOICES,
        default='cod'
    )


class OrderItemSerializer(serializers.ModelSerializer):

    subtotal = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = OrderItem

        fields = [
            'id',
            'product_name',
            'variant_sku',
            'size',
            'color',
            'quantity',
            'unit_price',
            'subtotal',
        ]


class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order

        fields = [
            'id',
            'full_name',
            'phone_number',
            'shipping_address',
            'payment_method',
            'payment_status',
            'status',
            'total_amount',
            'items',
            'created_at',
            'updated_at',
        ]

        read_only_fields = fields
