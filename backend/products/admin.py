
from django.contrib import admin
from .models import Team, Category, Product, ProductVariant


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'primary_color', 'created_at')
    search_fields = ('name',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'team', 'category', 'price', 'is_active')
    list_filter = ('team', 'category', 'is_active')
    search_fields = ('name', 'description')
    inlines = [ProductVariantInline]
