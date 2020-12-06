/**
 * curDate : 현재 조회 날짜
 * curRoom : 현재 조회 방
 * 
 * ALERT_INTERVAL : alert 띄워주는 시간
 */
var curDate;
var curRoom;

var ALERT_INTERVAL = 2000;

/**
 * schedule 기본 CRUD 영역
 * 
 * select
 * insert
 * remove
 */
function select($, targetRoom, targetDate) {
    var targetDate = convertToStr(targetDate);

    $.ajax({
        url : "/" + targetRoom + "/" + targetDate,
        method : 'GET',
        
        success : function(data){
            curDate = targetDate;
            curRoom = targetRoom;
            
            /**
             * 날짜 현행화
             * 
             * calendar.setDate
             * renderRange
             */
            calendar.setDate(convertToDate(curDate));
            $('#renderRange').text(formatStr(curDate));

            /**
             * 방 현행화
             * 
             * room-num
             */
            $('#room-num').text('Piano #' + curRoom);

            /**
             * modal 현행화
             */
            setWriteModal(false, false);

            /**
             * calendar 조회 스케쥴 생성
             */
            var schedules = [];

            calendar.clear();

            $(data).each(function(index, schedule){
                var username = schedule.name;
                var schedule = schedule.schedule;

                var options = {
                    id : schedule.id,
                    calendarId : calendar,
                    title : 'piano #' + schedule.piano + " : " + username,
                    category : 'time',
                    dueDateClass: '',
                    location : 'piano #' + schedule.piano,
                    attendees : [username, ],
                    start : convertToDate(schedule.date, schedule.start_time),
                    end : convertToDate(schedule.date, schedule.end_time)
                };

                if (userId == schedule.user) {
                    options.bgColor = '#ffbb3b';
                    options.color = '#ffffff';
                } else {
                    options.bgColor = '#00a9ff';
                    options.color = '#ffffff';
                    options.isReadOnly = 'true';
                }

                schedules.push(options);
            });

            calendar.createSchedules(schedules);
            calendar.render();
        }
    });
}

function insert($, csrf_token, targetRoom, targetDate, command, startTime, endTime, scheduleId) {
    $.ajax({
        url : "/" + targetRoom + "/" + targetDate,
        method : 'POST',
        headers: {
            'X-CSRFToken' : csrf_token
        },

        data : {
            'command' : command,
            'scheduleId' : scheduleId,
            'startTime' : startTime,
            'endTime' : endTime
        },

        statusCode : {
            202 : function() {
                $('#writeScheduleModal').modal('hide');
                select($, curRoom, convertToDate(curDate));

                toggleAlert($, 'danger', '중복된 스케줄이 존재합니다.');
            },

            204 : function() {
                $('#writeScheduleModal').modal('hide');
                select($, curRoom, convertToDate(curDate));

                toggleAlert($, 'success', '적용이 완료되었습니다.');
            },

            403 : function() {
                $('#writeScheduleModal').modal('hide');
                select($, curRoom, convertToDate(curDate));

                toggleAlert($, 'danger', '권한이 부족합니다.');
            }
        }
    });
}

function remove($, csrf_token, targetRoom, targetDate, scheduleId) {
    $.ajax({
        url : "/" + targetRoom + "/" + targetDate,
        method : 'POST',
        headers: {
            'X-CSRFToken' : csrf_token
        },

        data : {
            'command' : 'delete',
            'scheduleId' : scheduleId
        },

        statusCode : {
            204 : function() {
                $('#removeScheduleModal').modal('hide');
                select($, curRoom, convertToDate(curDate));

                toggleAlert($, 'success', '적용이 완료되었습니다.');
            },

            403 : function() {
                $('#removeScheduleModal').modal('hide');
                select($, curRoom, convertToDate(curDate));

                toggleAlert($, 'danger', '권한이 부족합니다.');
            }
        }
    });
}

/**
 * alert 생성 이벤트 영역
 */
function toggleAlert($, color, message){
    $('#responseAlert').removeClass();
    $('#responseAlert').addClass(['alert',`alert-${color}`]);
    $('#responseAlert').text(message);

    setTimeout(function(){
        $('#responseAlert').addClass('d-none');
    }, ALERT_INTERVAL);
}