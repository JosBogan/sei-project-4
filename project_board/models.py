from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Project(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(User, related_name='projects', null=True, on_delete=models.CASCADE)