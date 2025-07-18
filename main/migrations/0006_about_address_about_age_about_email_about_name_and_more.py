# Generated by Django 5.2.3 on 2025-07-13 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0005_about_bgimage"),
    ]

    operations = [
        migrations.AddField(
            model_name="about",
            name="address",
            field=models.CharField(default="Your Address", max_length=300),
        ),
        migrations.AddField(
            model_name="about",
            name="age",
            field=models.PositiveIntegerField(default=18),
        ),
        migrations.AddField(
            model_name="about",
            name="email",
            field=models.EmailField(default="you@example.com", max_length=254),
        ),
        migrations.AddField(
            model_name="about",
            name="name",
            field=models.CharField(default="Your Name", max_length=100),
        ),
        migrations.AddField(
            model_name="about",
            name="occupation",
            field=models.CharField(default="Student", max_length=100),
        ),
        migrations.AddField(
            model_name="about",
            name="phone",
            field=models.CharField(default="0000000000", max_length=15),
        ),
    ]
