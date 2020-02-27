from rest_framework import serializers
from .models import Project, Comment
from tasks.models import Task
from columns.models import Column

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = '__all__'

class ColumnSerializer(serializers.ModelSerializer):

    class Meta:
        model = Column
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):

    columns = ColumnSerializer(many=True)

    class Meta:
        model = Task
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = '__all__'

class PopulatedProjectTaskSerializer(ProjectSerializer):

    comments = CommentSerializer(many=True)
    tasks = TaskSerializer(many=True)
