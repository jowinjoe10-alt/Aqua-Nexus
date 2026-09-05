from django.core.management.base import BaseCommand
from django.utils import timezone

from product.models import Chat


class Command(BaseCommand):

    help = 'Delete chats that have expired.'

    def handle(self, *args, **kwargs):

        current_time = timezone.now()

        expired_chats = Chat.objects.filter(
            expires_at__isnull=False,
            expires_at__lte=current_time
        )

        count = expired_chats.count()

        expired_chats.delete()

        self.stdout.write(
            self.style.SUCCESS(
                f'{count} expired chat(s) deleted.'
            )
        )