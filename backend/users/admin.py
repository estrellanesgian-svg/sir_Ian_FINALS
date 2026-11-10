
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User
# Register your models here.

@admin.register(User)
class CustomUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        ('Additional Information', {
            'fields': ('phone_number',)
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Information', {
            'fields': ('email', 'phone_number')
        }),
    )

    list_display = (
        'username',
        'email',
        'first_name',
        'last_name',
        'is_staff',
    )

    search_fields = (
        'username',
        'email',
    )
