from rest_framework import serializers
from .models import Project
from tasks.models import Task

class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = '__all__'

class PopulatedProjectTaskSerializer(ProjectSerializer):

    tasks = TaskSerializer(many=True)
