from django.shortcuts import render, redirect
from django.forms.models import model_to_dict
from django.http.response import HttpResponse
import json

from .models import PianoRoom
from .schedule import *

# Create your views here.

def home(request):
    if not request.user.is_authenticated:
        return redirect('account:signin')

    pianos = PianoRoom.objects.all()

    if pianos.exists() == False:
        for piano_index in range(1, 10):
            piano = PianoRoom()
            piano.name = piano_index

            piano.save()

    context = {
        'pianos' : pianos
    }

    return render(request, 'home.html', context)

def schedule(request, piano_room, date):
    return_status = ''

    if request.user.is_authenticated and request.is_ajax():
        if request.method == 'GET':
            # schedule 조회

            schedules = schedule_select(piano_room, date)
            context = []

            for schedule in schedules:
                context.append({
                    'schedule' : model_to_dict(schedule),
                    'name' : schedule.user.username
                })

            return HttpResponse(json.dumps(context), content_type='application/json')

        elif request.method == 'POST':
            # return_status
            #
            # 204 : No Content      - DB에 성공적으로 반영됨
            # 
            # 202 : Accepted        - 서버가 수신하였으나 날짜중복조건으로 인해 DB에 반영되지 않음
            # 403 : Forbidden       - schedule 수정 혹은 삭제요청 시 사용자 권한이 없음
            # 401 : Unauthorized    - 로그인 필요

            command = request.POST['command']
            user_id = request.user.id

            if command == 'create':
                # schedule 생성

                start_time = request.POST['startTime']
                end_time = request.POST['endTime']

                return_status = schedule_create(user_id, piano_room, date, start_time, end_time)
            elif command == 'update':
                # schedule 변경

                schedule_id = request.POST['scheduleId']
                start_time = request.POST['startTime']
                end_time = request.POST['endTime']

                return_status = schedule_update(user_id, piano_room, date, schedule_id, start_time, end_time)
            elif command == 'delete':
                # schedule 삭제

                schedule_id = request.POST['scheduleId']

                return_status = schedule_delete(user_id, schedule_id)
    else:
        # status 401 : Unauthorized
        return_status = 401

    return HttpResponse(status=return_status)