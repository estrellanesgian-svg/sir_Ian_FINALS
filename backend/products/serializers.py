
from rest_framework import serializers
from .models import Team, Category, Product, ProductVariant


class TeamSerializer(serializers.ModelSerializer):

    class Meta:
        model = Team
        fields = [
            'id',
            'name',
            'description',
            'logo',
            'primary_color',
        ]


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'description',
        ]


class ProductVariantSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductVariant
        fields = [
            'id',
            'size',
            'color',
            'sku',
            'stock',
        ]


class ProductSerializer(serializers.ModelSerializer):

    team = TeamSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    variants = ProductVariantSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Product

        fields = [
            'id',
            'team',
            'category',
            'name',
            'description',
            'price',
            'image',
            'is_active',
            'variants',
            'created_at',
            'updated_at',
        ]
