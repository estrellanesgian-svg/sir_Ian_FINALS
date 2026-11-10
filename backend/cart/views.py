from django.shortcuts import render
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Cart, CartItem
from .serializers import (
    CartSerializer,
    AddCartItemSerializer,
    UpdateCartItemSerializer,
)
# Create your views here.

class CartView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        cart = Cart.objects.prefetch_related(
            'items__product_variant__product__team'
        ).get(pk=cart.pk)

        serializer = CartSerializer(cart, context={'request': request})

        return Response(serializer.data)


class CartItemView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = AddCartItemSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        variant = serializer.validated_data['variant']
        quantity = serializer.validated_data['quantity']

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product_variant=variant,
            defaults={
                'quantity': quantity
            }
        )

        if not item_created:

            new_quantity = cart_item.quantity + quantity

            if new_quantity > variant.stock:
                return Response(
                    {
                        'error': 'Not enough stock available.'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            cart_item.quantity = new_quantity
            cart_item.save()

        cart = Cart.objects.prefetch_related(
            'items__product_variant__product__team'
        ).get(pk=cart.pk)

        return Response(
           CartSerializer(cart, context={'request': request}).data,
            status=(
                status.HTTP_201_CREATED
                if item_created
                else status.HTTP_200_OK
            )
        )


class CartItemDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get_item(self, request, pk):

        return get_object_or_404(
            CartItem.objects.select_related(
                'cart',
                'product_variant__product__team'
            ),
            pk=pk,
            cart__user=request.user
        )

    def patch(self, request, pk):

        cart_item = self.get_item(request, pk)

        serializer = UpdateCartItemSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        quantity = serializer.validated_data['quantity']

        if quantity > cart_item.product_variant.stock:
            return Response(
                {
                    'error': 'Not enough stock available.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save()

        cart = Cart.objects.prefetch_related(
            'items__product_variant__product__team'
        ).get(pk=cart_item.cart_id)

        return Response(CartSerializer(cart, context={'request': request}).data)

    def delete(self, request, pk):

        cart_item = self.get_item(request, pk)

        cart = cart_item.cart

        cart_item.delete()

        cart = Cart.objects.prefetch_related(
            'items__product_variant__product__team'
        ).get(pk=cart.pk)

        return Response(
            CartSerializer(cart, context={'request': request}).data,
            status=status.HTTP_200_OK
        )

