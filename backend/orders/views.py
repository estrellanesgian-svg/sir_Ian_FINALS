from django.shortcuts import render
from decimal import Decimal

from django.db import transaction

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from cart.models import Cart, CartItem
from products.models import ProductVariant

from .models import Order, OrderItem
from .serializers import (
    CheckoutSerializer,
    OrderSerializer,
)
# Create your views here.

class CheckoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = CheckoutSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        cart = Cart.objects.filter(
            user=request.user
        ).first()

        if not cart:
            return Response(
                {'error': 'Your shopping cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():

            cart_items = list(
                CartItem.objects.filter(
                    cart=cart
                ).select_related(
                    'product_variant__product__team'
                )
            )

            if not cart_items:
                return Response(
                    {'error': 'Your shopping cart is empty.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            order_details = []
            total_amount = Decimal('0.00')

            # Validate all products and stock first
            for item in cart_items:

                variant = ProductVariant.objects.select_for_update(
                ).select_related(
                    'product__team'
                ).get(
                    pk=item.product_variant_id
                )

                if not variant.product.is_active:
                    return Response(
                        {
                            'error': (
                                f'{variant.product.name} is unavailable.'
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if variant.stock < item.quantity:
                    return Response(
                        {
                            'error': (
                                f'Not enough stock for '
                                f'{variant.product.name}.'
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                unit_price = variant.product.price

                total_amount += unit_price * item.quantity

                order_details.append({
                    'item': item,
                    'variant': variant,
                    'unit_price': unit_price,
                })

            # Create order only after all stock checks pass
            order = Order.objects.create(
                user=request.user,
                full_name=serializer.validated_data['full_name'],
                phone_number=serializer.validated_data['phone_number'],
                shipping_address=serializer.validated_data['shipping_address'],
                payment_method=serializer.validated_data['payment_method'],
                total_amount=total_amount,
            )

            # Save order items and reduce stock
            for detail in order_details:

                item = detail['item']
                variant = detail['variant']
                unit_price = detail['unit_price']

                OrderItem.objects.create(
                    order=order,
                    product_variant=variant,
                    product_name=variant.product.name,
                    variant_sku=variant.sku,
                    size=variant.size,
                    color=variant.color,
                    quantity=item.quantity,
                    unit_price=unit_price,
                )

                variant.stock -= item.quantity

                variant.save(
                    update_fields=['stock']
                )

            # Clear purchased cart items
            CartItem.objects.filter(
                cart=cart
            ).delete()

        order = Order.objects.prefetch_related(
            'items'
        ).get(pk=order.pk)

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class OrderListView(generics.ListAPIView):

    serializer_class = OrderSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):

    serializer_class = OrderSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related('items')
