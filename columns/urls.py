from django.urls import path
from .views import ColumnListView, ColumnDeleteView, ColumnEditView

urlpatterns = [
    path('<int:col_id>/<int:col_pk>/', ColumnEditView.as_view()),
    path('<int:col_id>/', ColumnDeleteView.as_view()),
    path('', ColumnListView.as_view()),
]