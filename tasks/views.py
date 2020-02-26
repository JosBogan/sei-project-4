# pylint: disable=no-member

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_201_CREATED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_401_UNAUTHORIZED

from .serializers import TaskSerializer
from project_board.serializers import ProjectSerializer

from .models import Task
from project_board.models import Project


# class TaskListView(APIView):

#     permission_classes = (IsAuthenticated, )

#     def get(self, _request):

#         tasks = Task.objects.get()

class TaskListView(APIView):

    permission_classes = (IsAuthenticated, )

    def post(self, request, pk):
        request.data['project'] = pk
        task = TaskSerializer(data=request.data)
        if task.is_valid():
            project = Project.objects.get(pk=pk)
            if request.user not in project.users.all():
                return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
            task.save()
            serialized_project = ProjectSerializer(project)
            return Response(serialized_project.data, status=HTTP_201_CREATED)
        return Response(task.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
