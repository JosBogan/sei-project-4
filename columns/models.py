from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Column(models.Model):
    STATUS_CHOICES = [
        ('done', 'Done'),
        ('in progress', 'In Progress'),
        ('stuck', 'Stuck'),
    ]
    COLUMN_TYPE_CHOICES = [
        ('status', 'Status'),
        ('text', 'Text'),
        ('rating', 'Rating'),
        ('date', 'Date'),
        ('users', 'Users'),
        ('priority', 'Priority'),
        ('numbers', 'Numbers'),
        ('checkbox', 'Checkbox'),
        ('progress', 'Progress')
    ]
    COL_ID = 1

    col_type = models.CharField(max_length=20, choices=COLUMN_TYPE_CHOICES)
    col_id = models.IntegerField()
    task = models.ForeignKey('tasks.Task', related_name='columns', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=True)
    numbers = models.IntegerField(blank=True, null=True)
    users = models.ManyToManyField(User, blank=True, related_name='tasks')