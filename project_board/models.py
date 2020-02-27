from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Project(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=100, blank=True)
    owner = models.ForeignKey(User, related_name='projects', on_delete=models.CASCADE)
    users = models.ManyToManyField(User, blank=True, related_name='collab_projects')

    def __str__(self):
        return f'{self.name} by {self.owner}'

class Comment(models.Model):
    text = models.CharField(max_length=500)
    project = models.ForeignKey(Project, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='comments', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.text} - {self.user} on {self.project}'
