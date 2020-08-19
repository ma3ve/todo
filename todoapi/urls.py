from django.urls import path
from .views import (get_tasks, create_task, patch_task, delete_task)

urlpatterns = [
    path('', get_tasks),
    path('create/', create_task),
    path('patch/', patch_task),
    path('delete/', delete_task)
]
