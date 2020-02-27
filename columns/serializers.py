from rest_framework import serializers
from .models import Column
from tasks.models import Task
from project_board.models import Project

class ColumnSerializer(serializers.ModelSerializer):

    class Meta:
        model = Column
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):

    columns = ColumnSerializer(many=True)

    class Meta:
        model = Task
        fields = '__all__'

class PopulatedProjectSerializer(serializers.ModelSerializer):

    tasks = TaskSerializer(many=True)

    class Meta:
        model = Project
        fields = '__all__'
