
from rest_framework import serializers

from .models import Cart, CartItem
from products.models import ProductVariant


class CartItemSerializer(serializers.ModelSerializer):

    variant_id = serializers.IntegerField(
        source='product_variant.id',
        read_only=True
    )

    product_name = serializers.CharField(
        source='product_variant.product.name',
        read_only=True
    )

    team_name = serializers.CharField(
        source='product_variant.product.team.name',
        read_only=True
    )

    price = serializers.DecimalField(
        source='product_variant.product.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    image = serializers.ImageField(
        source='product_variant.product.image',
        read_only=True
    )

    size = serializers.CharField(
        source='product_variant.size',
        read_only=True
    )

    color = serializers.CharField(
        source='product_variant.color',
        read_only=True
    )

    sku = serializers.CharField(
        source='product_variant.sku',
        read_only=True
    )

    stock = serializers.IntegerField(
        source='product_variant.stock',
        read_only=True
    )

    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem

        fields = [
            'id',
            'variant_id',
            'product_name',
            'team_name',
            'price',
            'image',
            'size',
            'color',
            'sku',
            'stock',
            'quantity',
            'subtotal',
        ]

    def get_subtotal(self, obj):
        return obj.product_variant.product.price * obj.quantity


class CartSerializer(serializers.ModelSerializer):

    items = CartItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Cart

        fields = [
            'id',
            'items',
            'created_at',
            'updated_at',
        ]


class AddCartItemSerializer(serializers.Serializer):

    variant_id = serializers.IntegerField()

    quantity = serializers.IntegerField(
        min_value=1,
        default=1
    )

    def validate(self, attrs):

        try:
            variant = ProductVariant.objects.select_related(
                'product'
            ).get(pk=attrs['variant_id'])

        except ProductVariant.DoesNotExist:
            raise serializers.ValidationError({
                'variant_id': 'Product variant does not exist.'
            })

        if not variant.product.is_active:
            raise serializers.ValidationError({
                'variant_id': 'This product is unavailable.'
            })

        if attrs['quantity'] > variant.stock:
            raise serializers.ValidationError({
                'quantity': 'Not enough stock available.'
            })

        attrs['variant'] = variant

        return attrs


class UpdateCartItemSerializer(serializers.Serializer):

    quantity = serializers.IntegerField(
        min_value=1
    )
