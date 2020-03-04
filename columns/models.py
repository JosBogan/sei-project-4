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
    PRIORITY_CHOICES = [
        ('urgent', 'Urgent'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low')
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
        ('progress', 'Progress'),
        ('file', 'File')
    ]
    COL_ID = 1

    col_type = models.CharField(max_length=20, choices=COLUMN_TYPE_CHOICES)
    col_id = models.IntegerField()
    task = models.ForeignKey('tasks.Task', related_name='columns', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=True)
    numbers = models.IntegerField(blank=True, null=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, blank=True, null=True)
    users = models.ManyToManyField(User, blank=True, related_name='tasks')
    text = models.CharField(max_length=15, blank=True, null=True)
    date = models.DateField(auto_now=False, auto_now_add=False, blank=True, null=True)
    file = models.CharField(max_length=500, blank=True, null=True)
