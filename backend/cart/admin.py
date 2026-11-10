from django.contrib import admin
from .models import Cart, CartItem
# Register your models here.

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'created_at',
        'updated_at'
    )

    search_fields = (
        'user__username',
        'user__email'
    )

    inlines = [CartItemInline]