from datetime import datetime, timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_422_UNPROCESSABLE_ENTITY

# Serializer Imports
from .serializers import UserSerializer
# Model Imports
from django.contrib.auth import get_user_model

from django.conf import settings
import jwt

User = get_user_model()

class RegisterView(APIView):

    def post(self, request):
        serialized_user = UserSerializer(data=request.data)
        print(serialized_user)
        if serialized_user.is_valid():
            serialized_user.save()
            return Response({'message': 'Registration Sucessfull'})

        return Response(serialized_user.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)

class LoginView(APIView):

    def post(self, request):
        
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
        serialized_users = UserSerializer(users, many=True)
        return Response(serialized_users.data)
