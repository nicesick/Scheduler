from django.db import models
from django.conf import settings

# Create your models here.

class PianoRoom(models.Model):
    name = models.CharField(max_length=100)    

class Schedule(models.Model):
    date = models.CharField(max_length=8)
    start_time = models.CharField(max_length=4)
    end_time = models.CharField(max_length=4)

    created_at = models.DateTimeField(auto_now_add=True)

    piano = models.ForeignKey(PianoRoom, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def is_permitted(self, user_id):
        return self.user_id == user_id