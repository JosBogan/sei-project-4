# pylint: disable=no-member

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_201_CREATED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_401_UNAUTHORIZED, HTTP_404_NOT_FOUND, HTTP_202_ACCEPTED

from .serializers import TaskSerializer
from project_board.serializers import ProjectSerializer, PopulatedProjectTaskSerializer

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

class TaskDetailView(APIView):

    permission_classes = (IsAuthenticated, )

    def delete(self, request, **kwargs):
        try:
            task = Task.objects.get(pk=kwargs['t_pk'])
            project = Project.objects.get(pk=kwargs['pk'])
            if request.user not in project.users.all(): # CHECK THAT I CAN DO THIS BEFPRE SERIALIZATION
                return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
            task.delete()
            serialized_project = PopulatedProjectTaskSerializer(project)
            return Response(serialized_project.data)
        except Task.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)
        except Project.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)

    def put(self, request, **kwargs):
        try:
            request.data['project'] = kwargs['pk']
            task = Task.objects.get(pk=kwargs['t_pk'])
            project = Project.objects.get(pk=kwargs['pk'])
            if request.user not in project.users.all(): # CHECK THAT I CAN DO THIS BEFPRE SERIALIZATION
                return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
            updated_task = TaskSerializer(task, data=request.data)
            if updated_task.is_valid():
                updated_task.save()
                serialized_project = PopulatedProjectTaskSerializer(project)
                return Response(serialized_project.data, status=HTTP_202_ACCEPTED)
            return Response(updated_task.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
        except Task.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)
        except Project.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)
