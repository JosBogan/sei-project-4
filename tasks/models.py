from django.db import models

class Task(models.Model):
    
    text = models.CharField(max_length=50)
    project = models.ForeignKey('project_board.Project', related_name='tasks', on_delete=models.CASCADE)
    group = models.CharField(max_length=50, blank=True)