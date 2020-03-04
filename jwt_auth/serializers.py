from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
# import django.contrib.auth.password_validation as validations

User = get_user_model()

from project_board.models import Project
from columns.models import Column
from tasks.models import Task

class UserSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):
        password = data.pop('password')
        password_confirmation = data.pop('password_confirmation')

        if password != password_confirmation:
            raise ValidationError({'password_confirmation': 'Does Not Match'})

        # try:
        #     validations.validate_password(password=password)
        # except ValidationError as err:
        #     raise serializers.ValidationError({'password_confirmation': err.message})

        data['password'] = make_password(password)
        
        return data

    class Meta:
        model = User
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = '__all__'

class CollaboratedProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = '__all__'

class EditUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

class SearchUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'image', 'id', 'email')

class ColumnSerializer(serializers.ModelSerializer):

    class Meta:
        model = Column
        fields = '__all__'

class PopulatedTaskSerializer(serializers.ModelSerializer):

    columns = ColumnSerializer(many=True)

    class Meta:
        model = Task
        fields = '__all__'
        
class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = '__all__'

class PopulatedColumnSerializer(serializers.ModelSerializer):

    task = PopulatedTaskSerializer()

    class Meta:
        model = Column
        fields = '__all__'

class PopulatedUserSerializer(serializers.ModelSerializer):

    tasks = PopulatedColumnSerializer(many=True)
    collab_projects = CollaboratedProjectSerializer(many=True)
    projects = ProjectSerializer(many=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'image', 'projects', 'id', 'collab_projects', 'tasks')