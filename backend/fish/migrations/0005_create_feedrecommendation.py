from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("fish", "0004_alter_fishstage_max_weight_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="FeedRecommendation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "feed_type",
                    models.CharField(
                        max_length=100
                    ),
                ),
                (
                    "feed_form",
                    models.CharField(
                        max_length=50,
                        blank=True,
                        null=True,
                    ),
                ),
                (
                    "protein_min",
                    models.DecimalField(
                        max_digits=5,
                        decimal_places=2,
                    ),
                ),
                (
                    "protein_max",
                    models.DecimalField(
                        max_digits=5,
                        decimal_places=2,
                    ),
                ),
                (
                    "particle_size_min",
                    models.DecimalField(
                        max_digits=5,
                        decimal_places=2,
                    ),
                ),
                (
                    "particle_size_max",
                    models.DecimalField(
                        max_digits=5,
                        decimal_places=2,
                    ),
                ),
                (
                    "is_organic",
                    models.BooleanField(
                        default=False
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(
                        auto_now_add=True
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        auto_now=True
                    ),
                ),
                (
                    "fish_stage",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="feed_recommendations",
                        to="fish.fishstage",
                    ),
                ),
            ],
        ),
    ]