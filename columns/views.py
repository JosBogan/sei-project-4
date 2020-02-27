# pylint: disable=no-member

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_401_UNAUTHORIZED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_404_NOT_FOUND, HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_202_ACCEPTED
from rest_framework.response import Response

from .models import Column
from .serializers import ColumnSerializer, PopulatedProjectSerializer

from project_board.models import Project

class ColumnListView(APIView):

    permission_classes = (IsAuthenticated, )

    def post(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            if request.user not in project.users.all():
                return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
            tasks = project.tasks.all()
            for task in tasks:
                request.data['task'] = task.id
                request.data['col_id'] = Column.COL_ID
                column = ColumnSerializer(data=request.data)
                print(column)
                if column.is_valid():
                    column.save()
                else: 
                    return Response(column.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
            serialized_project = PopulatedProjectSerializer(project)
            Column.COL_ID += 1
            return Response(serialized_project.data, status=HTTP_201_CREATED)
        except Project.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)

class ColumnDeleteView(APIView):

    permission_classes = (IsAuthenticated, )

    def delete(self, request, **kwargs):
        try:
            project = Project.objects.get(pk=kwargs['pk'])
            if request.user not in project.users.all():
                return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
            columns = Column.objects.all().filter(col_id=kwargs['col_id'])
            columns.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        except Column.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)

class ColumnEditView(APIView):

    permission_classes = (IsAuthenticated, )

    def put(self, request, **kwargs):
        try:
            project = Project.objects.get(pk=kwargs['pk'])
            if request.user not in project.users.all():
                return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
            column = Column.objects.get(pk=kwargs['col_pk'])
            pre_serialized_column = ColumnSerializer(column)
            request.data['col_type'] = pre_serialized_column.data['col_type']
            request.data['task'] = pre_serialized_column.data['task']
            request.data['col_id'] = pre_serialized_column.data['col_id']
            serialized_column = ColumnSerializer(column, data=request.data)
            if serialized_column.is_valid():
                serialized_column.save()
                return Response(serialized_column.data, status=HTTP_202_ACCEPTED)
            return Response(serialized_column.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
        except Column.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)
