/**
 * 전역변수
 *
 * calendar     - 캘린더 변수
 *
 * startTime    - 예약 시작 시간 타임 픽커
 * endTime      - 예약 종료 시간 타임 픽커
 */
var calendar;

var startTime;
var endTime;

/**
 * 캘린더 정의 및 초기화 영역
 */
(function(){
    startTime = new tui.TimePicker('#startTime', {
        inputType : 'selectBox',
        showMeridiem : false,
        initialHour : 0,
        initialMinute : 0,
        hourStep : 1,
        minuteStep : 30
    });

    endTime = new tui.TimePicker('#endTime', {
        inputType : 'selectBox',
        showMeridiem : false,
        initialHour : 0,
        initialMinute : 0,
        hourStep : 1,
        minuteStep : 30
    });

    calendar = new tui.Calendar('#calendar', {
        defaultView: 'day',
        taskView : false,
        scheduleView : ['time'],
        useDetailPopup : true,
        disableDblClick : true,
        disableClick : true,
    });
}(jQuery));