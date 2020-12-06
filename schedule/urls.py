from django.urls import path
from . import views

app_name='schedule'

urlpatterns = [
    path('', views.home, name='home'),
    path('<int:piano_room>/<str:date>', views.schedule, name='schedule'),
]