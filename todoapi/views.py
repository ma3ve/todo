from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from .serializers import Task_serializer
from .models import Task_model
from knox.auth import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from collections import OrderedDict

# Create your views here.


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_task(request, *args, **kwargs):
    data = OrderedDict()
    data.update(request.data)
    print(data)
    data['user'] = request.user.id
    serializer = Task_serializer(data=data)
    if(serializer.is_valid(raise_exception=True)):
        task = serializer.save()
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_tasks(request, *args, **kwargs):
    qs = Task_model.objects.filter(user=request.user)
    serializer = Task_serializer(qs, many=True)
    return Response(serializer.data)


@api_view(['PATCH', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def patch_task(request, *args, **kwargs):
    qs = Task_model.objects.filter(id=request.data.get("id"))
    if not qs.exists():
        return Response({"error": "task doesnt exits"})
    task = qs.first()

    print(request.data)
    if("task" in request.data):
        task.task = request.data["task"]
    if("completed" in request.data):
        task.completed = request.data["completed"]
    task.save()

    return Response({"success": True})


@api_view(['PATCH', 'POST', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_task(request, *args, **kwargs):
    qs = Task_model.objects.filter(id=request.data.get("id"))
    if not qs.exists():
        return Response({"error": "task doesnt exits"})
    task = qs.first()
    task.delete()
    return Response({"success": True})
