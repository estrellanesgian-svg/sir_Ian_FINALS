from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Team, Category, Product

from .serializers import (
    TeamSerializer,
    CategorySerializer,
    ProductSerializer,
)
# Create your views here.

class TeamListView(generics.ListAPIView):

    queryset = Team.objects.all()

    serializer_class = TeamSerializer

    permission_classes = [AllowAny]


class CategoryListView(generics.ListAPIView):

    queryset = Category.objects.all()

    serializer_class = CategorySerializer

    permission_classes = [AllowAny]


class ProductListView(generics.ListAPIView):

    queryset = Product.objects.filter(
        is_active=True
    ).select_related(
        'team',
        'category'
    ).prefetch_related(
        'variants'
    )

    serializer_class = ProductSerializer

    permission_classes = [AllowAny]


class ProductDetailView(generics.RetrieveAPIView):

    queryset = Product.objects.filter(
        is_active=True
    ).select_related(
        'team',
        'category'
    ).prefetch_related(
        'variants'
    )

    serializer_class = ProductSerializer

    permission_classes = [AllowAny]

