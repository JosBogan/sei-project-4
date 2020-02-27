from django.urls import path, include

from .views import ProjectListView, ProjectDetailView, CommentListView, CommentDetailView

urlpatterns = [
    path('', ProjectListView.as_view()),
    path('<int:pk>/', ProjectDetailView.as_view()),
    path('<int:pk>/comments/', CommentListView.as_view()),
    path('<int:pk>/comments/<int:c_pk>/', CommentDetailView.as_view()),
    path('<int:pk>/tasks/', include('tasks.urls')),
    path('<int:pk>/columns/', include('columns.urls'))
]