from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Project(models.Model):
    name = models.CharField(max_length=50)
    owner = models.ForeignKey(User, related_name='projects', on_delete=models.CASCADE)
    users = models.ManyToManyField(User, blank=True, related_name='collab_projects')

    def __str__(self):
        return f'{self.name} by {self.owner}'
