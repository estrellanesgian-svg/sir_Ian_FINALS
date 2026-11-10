from django.db import models

# Create your models here.
class Team(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.TextField(
        blank=True
    )

    logo = models.ImageField(
        upload_to='teams/',
        blank=True,
        null=True
    )

    primary_color = models.CharField(
        max_length=7,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Category(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Product(models.Model):
    team = models.ForeignKey(
        Team,
        on_delete=models.PROTECT,
        related_name='products'
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products'
    )

    name = models.CharField(
        max_length=200
    )

    description = models.TextField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class ProductVariant(models.Model):

    SIZE_CHOICES = [
        ('XS', 'Extra Small'),
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'Extra Large'),
        ('XXL', '2X Large'),
        ('OS', 'One Size'),
    ]

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )

    size = models.CharField(
        max_length=3,
        choices=SIZE_CHOICES,
        blank=True
    )

    color = models.CharField(
        max_length=50,
        blank=True
    )

    sku = models.CharField(
        max_length=50,
        unique=True
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    def __str__(self):
        return f'{self.product.name} - {self.size or "Standard"} - {self.color or "Default"}'
