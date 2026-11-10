from django.contrib import admin
from .models import Order, OrderItem
# Register your models here.

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

    readonly_fields = (
        'product_name',
        'variant_sku',
        'size',
        'color',
        'quantity',
        'unit_price',
    )

    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'full_name',
        'total_amount',
        'payment_method',
        'payment_status',
        'status',
        'created_at',
    )

    list_filter = (
        'status',
        'payment_status',
        'payment_method',
        'created_at',
    )

    search_fields = (
        'user__username',
        'full_name',
        'phone_number',
    )

    readonly_fields = (
        'total_amount',
        'created_at',
        'updated_at',
    )

    inlines = [OrderItemInline]
