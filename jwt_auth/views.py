from datetime import datetime, timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_422_UNPROCESSABLE_ENTITY, HTTP_404_NOT_FOUND, HTTP_202_ACCEPTED

# Serializer Imports
from .serializers import UserSerializer, PopulatedUserSerializer, SearchUserSerializer, EditUserSerializer
# Model Imports
from django.contrib.auth import get_user_model

from django.conf import settings
import jwt

User = get_user_model()

class RegisterView(APIView):

    def post(self, request):
        request.data['image'] = 'https://miro.medium.com/max/560/1*MccriYX-ciBniUzRKAUsAw.png'
        serialized_user = UserSerializer(data=request.data)
        print(serialized_user)
        if serialized_user.is_valid():
            serialized_user.save()
            return Response({'message': 'Registration Sucessfull'})

        return Response(serialized_user.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

class LoginView(APIView):

    def post(self, request):
        print('getting to the backend')
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)

            if not user.check_password(password):
                raise PermissionDenied({'message': 'Invalid Credentials'})

            dt = datetime.now() + timedelta(days=7)

            token = jwt.encode({'sub': user.id, 'exp': int(dt.strftime('%s'))}, settings.SECRET_KEY, algorithm='HS256')
            return Response({'token': token, 'message': f'Welcome back {user.username}'})
        except User.DoesNotExist:
            raise PermissionDenied({'message': 'Invalid Credentials'})

class UserListView(APIView):

    permission_classes = (IsAuthenticated, )

    def get(self, _request):

        users = User.objects.all()
        serialized_users = SearchUserSerializer(users, many=True)
        return Response(serialized_users.data)

class UserDetailView(APIView):

    permission_classes = (IsAuthenticated, )

    def get(self, request):
        try:
            user = User.objects.get(pk=request.user.id)
            serialized_user = PopulatedUserSerializer(user)
            print(serialized_user)
            return Response(serialized_user.data)
        except User.DoesNotExist:
            return Response({'message': 'Does Not Exist'}, status=HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            user = User.objects.get(pk=request.user.id)
            updated_user = SearchUserSerializer(user, data=request.data)
            if updated_user.is_valid():
                updated_user.save()
                return Response(updated_user.data, HTTP_202_ACCEPTED)
            return Response(updated_user.errors, HTTP_422_UNPROCESSABLE_ENTITY)
        except User.DoesNotExist:
            return Response({'message': 'Does Not Exist'}, status=HTTP_404_NOT_FOUND)