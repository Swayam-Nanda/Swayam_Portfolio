# Generated by Django 5.2.3 on 2025-07-13 13:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0004_about_long_description"),
    ]

    operations = [
        migrations.AddField(
            model_name="about",
            name="bgimage",
            field=models.ImageField(blank=True, null=True, upload_to="about/"),
        ),
    ]
