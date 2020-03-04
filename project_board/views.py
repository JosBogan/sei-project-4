# pylint: disable=no-member

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_401_UNAUTHORIZED, HTTP_202_ACCEPTED, HTTP_404_NOT_FOUND, HTTP_204_NO_CONTENT
from rest_framework.permissions import IsAuthenticated

# Model Imports
from .models import Project, Comment

# Serializer Imports
from .serializers import ProjectSerializer, PopulatedProjectTaskSerializer, PopulatedCommentSerializer, CommentSerializer

class ProjectListView(APIView):

    permission_classes = (IsAuthenticated, )

    def get(self, _request):
        projects = Project.objects.all()
        serialized_projects = ProjectSerializer(projects, many=True)
        return Response(serialized_projects.data)

    def post(self, request):
        project = ProjectSerializer(data=request.data)
        request.data['owner'] = request.user.id
        print(request.data)
        if request.data['users']:
            request.data['users'].insert(0, request.user.id)
        else:
            request.data['users'] = [request.user.id]
        if not request.data['description']:
            request.data['description'] = 'Add project description'
        if project.is_valid():
            project.save()
            return Response(project.data, status=HTTP_201_CREATED)
        return Response(project.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

class ProjectDetailView(APIView):

    permission_classes = (IsAuthenticated, )

    def get(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            serialized_project = PopulatedProjectTaskSerializer(project)
            if request.user in project.users.all():
                return Response(serialized_project.data)
            return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
        except Project.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            # if project.owner.id != request.user.id:
            #     return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
            updated_project = ProjectSerializer(project, data=request.data)
            if updated_project.is_valid():
                updated_project.save()
                return Response(updated_project.data, status=HTTP_202_ACCEPTED)
            return Response(updated_project.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
        except Project.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            # if project.owner.id != request.user.id:
            #     return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
            project.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        except Project.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)

class CommentListView(APIView):

    permission_classes = (IsAuthenticated, )

    def post(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            if request.user not in project.users.all():
                return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
            request.data['user'] = request.user.id
            request.data['project'] = pk
            comment = CommentSerializer(data=request.data)
            if comment.is_valid():
                comment.save()
                return Response(comment.data, status=HTTP_201_CREATED)
            return Response(project.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
        except Project.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            if request.user not in project.users.all():
                return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
            comments = Comment.objects.filter(project=pk)
            serialized_comment = PopulatedCommentSerializer(comments, many=True)
            return Response(serialized_comment.data)
        except Project.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)
            
class CommentDetailView(APIView):

    permission_classes = (IsAuthenticated, )

    def delete(self, request, **kwargs):
        try:
            comment = Comment.objects.get(pk=kwargs['c_pk'])
            if request.user.id != comment.user.id:
                return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
            comment.delete()
            return Response(HTTP_204_NO_CONTENT)
        except Comment.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)
    
    def put(self, request, **kwargs):
        try:
            comment = Comment.objects.get(pk=kwargs['c_pk'])
            if request.user.id != comment.user.id:
                return Response({'message': 'Unauthorized'}, status=HTTP_401_UNAUTHORIZED)
            request.data['user'] = request.user.id
            request.data['project'] = kwargs['pk']
            updated_comment = CommentSerializer(comment, data=request.data)
            if updated_comment.is_valid():
                updated_comment.save()
                return Response(updated_comment.data, status=HTTP_202_ACCEPTED)
            return Response(updated_comment.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
        except Comment.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)