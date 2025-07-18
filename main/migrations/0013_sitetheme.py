# Generated by Django 5.2.3 on 2025-07-14 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0012_hero_tagline"),
    ]

    operations = [
        migrations.CreateModel(
            name="SiteTheme",
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
                ("name", models.CharField(max_length=100)),
                ("bg_color", models.CharField(max_length=7)),
                ("second_bg_color", models.CharField(max_length=7)),
                ("text_color", models.CharField(max_length=7)),
                ("main_color", models.CharField(max_length=7)),
            ],
        ),
    ]
