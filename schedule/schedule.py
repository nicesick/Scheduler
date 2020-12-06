from .models import Schedule, PianoRoom

def schedule_select(piano_room, date):
    schedules = Schedule.objects.filter(piano_id=piano_room, date=date)

    return schedules

def schedule_create(user_id, piano_room, date, start_time, end_time):
    if check_schedule_date(piano_room, date, start_time, end_time):
        schedule = Schedule()

        schedule.user_id = user_id
        schedule.piano_id = piano_room
        schedule.date = date
        schedule.start_time = start_time
        schedule.end_time = end_time

        schedule.save()

        # status 204 : No Content
        return 204
    else:
        # status 202 : Accepted
        return 202

def schedule_update(user_id, piano_room, date, schedule_id, start_time, end_time):
    if check_schedule_date(piano_room, date, start_time, end_time, schedule_id):
        schedule = Schedule.objects.get(id=schedule_id)

        if schedule.is_permitted(user_id):
            schedule.start_time = start_time
            schedule.end_time = end_time

            schedule.save()

            # status 204 : No Content
            return 204
        else:
            # status 403 : Forbidden
            return 403
    else:
        # status 202 : Accepted
        return 202

def schedule_delete(user_id, schedule_id):
    schedule = Schedule.objects.get(id=schedule_id)

    if schedule.is_permitted(user_id):
        schedule.delete()

        # status 204 : No Content
        return 204
    else:
        # status 403 : Forbidden
        return 403

def check_schedule_date(piano_room, date, start_time, end_time, schedule_id = None):
    is_internal_schedule = ''
    is_external_schedule = ''

    is_start_crossed_schedule = ''
    is_end_crossed_schedule = ''

    if schedule_id == None:
        is_internal_schedule        = Schedule.objects.filter(piano_id=piano_room, date=date, start_time__gte=start_time, end_time__lte=end_time).exists()
        is_external_schedule        = Schedule.objects.filter(piano_id=piano_room, date=date, start_time__lte=start_time, end_time__gte=end_time).exists()

        is_start_crossed_schedule   = Schedule.objects.filter(piano_id=piano_room, date=date, start_time__gt=start_time, start_time__lt=end_time).exists()
        is_end_crossed_schedule     = Schedule.objects.filter(piano_id=piano_room, date=date, end_time__gt=start_time, end_time__lt=end_time).exists()
    else:
        is_internal_schedule        = Schedule.objects.filter(piano_id=piano_room, date=date, start_time__gte=start_time, end_time__lte=end_time).exclude(id=schedule_id).exists()
        is_external_schedule        = Schedule.objects.filter(piano_id=piano_room, date=date, start_time__lte=start_time, end_time__gte=end_time).exclude(id=schedule_id).exists()

        is_start_crossed_schedule   = Schedule.objects.filter(piano_id=piano_room, date=date, start_time__gt=start_time, start_time__lt=end_time).exclude(id=schedule_id).exists()
        is_end_crossed_schedule     = Schedule.objects.filter(piano_id=piano_room, date=date, end_time__gt=start_time, end_time__lt=end_time).exclude(id=schedule_id).exists()

    if is_internal_schedule or is_external_schedule or is_start_crossed_schedule or is_end_crossed_schedule:
        return False
    else:
        return True