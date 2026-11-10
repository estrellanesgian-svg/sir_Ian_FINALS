from django.urls import path

from .views import (
    TeamListView,
    CategoryListView,
    ProductListView,
    ProductDetailView,
)


urlpatterns = [
    path('teams/', TeamListView.as_view(), name='team-list'),

    path('categories/', CategoryListView.as_view(), name='category-list'),

    path('', ProductListView.as_view(), name='product-list'),

    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
]