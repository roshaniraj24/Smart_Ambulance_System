from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

class Command(BaseCommand):
    help = 'Create demo users for testing'

    def handle(self, *args, **options):
        # Create driver user
        driver, created = User.objects.get_or_create(
            username='driver@demo.com',
            defaults={
                'email': 'driver@demo.com',
                'first_name': 'Demo',
                'last_name': 'Driver',
                'user_type': 'driver',
                'is_active': True,
            }
        )
        if created:
            driver.set_password('demo123')
            driver.save()
            self.stdout.write(self.style.SUCCESS('Created demo driver user'))

        # Create hospital user
        hospital, created = User.objects.get_or_create(
            username='hospital@demo.com',
            defaults={
                'email': 'hospital@demo.com',
                'first_name': 'Demo',
                'last_name': 'Hospital',
                'user_type': 'hospital',
                'is_active': True,
            }
        )
        if created:
            hospital.set_password('demo123')
            hospital.save()
            self.stdout.write(self.style.SUCCESS('Created demo hospital user'))

        # Create admin user
        admin, created = User.objects.get_or_create(
            username='admin@demo.com',
            defaults={
                'email': 'admin@demo.com',
                'first_name': 'Demo',
                'last_name': 'Admin',
                'user_type': 'admin',
                'is_active': True,
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('demo123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('Created demo admin user'))
