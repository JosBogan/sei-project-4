# Generated by Django 2.2.9 on 2020-02-26 15:43

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project_board', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='users',
            field=models.ManyToManyField(blank=True, related_name='collab_projects', to=settings.AUTH_USER_MODEL),
        ),
    ]
