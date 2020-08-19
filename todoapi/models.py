from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Task_model(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    task = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
