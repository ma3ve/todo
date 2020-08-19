from rest_framework import serializers
from .models import Task_model


class Task_serializer(serializers.ModelSerializer):

    class Meta:
        model = Task_model
        fields = '__all__'

    def create(self, validated_data):
        task_model = Task_model(**validated_data)
        task_model.save()
        return task_model

    def get_user(self, obj):
        return self.context.get("user").id
