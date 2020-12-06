/**
 * 8자리 dateStr 을 Date 포맷으로 변경
 * 만약 timeStr 도 같이 들어온다면 time 정보도 추가
 *
 * 20200928 -> Mon Sep 28 2020 00:00:00 GMT+0900
 * 20200928, 1130 -> Mon Sep 28 2020 11:30:00 GMT+0900
 */
function convertToDate(targetStr, optionalStr = undefined) {
    var targetYear = targetStr.substring(0, 4);
    var targetMonth = targetStr.substring(4, 6);
    var targetDay = targetStr.substring(6, 8);

    var date;

    if (optionalStr != undefined) {
        var targetHour = optionalStr.substring(0, 2);
        var targetMinute = optionalStr.substring(2, 4);

        date = new Date(targetYear, targetMonth - 1, targetDay, targetHour, targetMinute);
    } else {
        date = new Date(targetYear, targetMonth - 1, targetDay);
    }

    return date;
}

/**
 * Date 포맷을 8자리 dateStr로 변경
 * 
 * Mon Sep 28 2020 00:00:00 GMT+0900 -> 20200928
 */
function convertToStr(targetDate, setTime=false) {
    var str = targetDate.getFullYear() + lpad(targetDate.getMonth() + 1, 2, '0') + lpad(targetDate.getDate(), 2, '0');

    if (setTime) {
        str += lpad(targetDate.getHours(), 2, '0') + lpad(targetDate.getMinutes(), 2, '0');
    }

    return str;
}

/**
 * 시간, 분 정보를 4자리 timeStr로 변경
 * 
 * @param {number} targetHour 
 * @param {number} targetMinute 
 */
function convertToStrTime(targetHour, targetMinute) {
    return lpad(targetHour, 2, '0') + lpad(targetMinute, 2, '0');
}

/**
 * 8자리 dateStr 을 10자리 dateStr로 변경
 * 
 * 20200928 -> 2020-09-28
 */
function formatStr(targetStr) {
    return targetStr.substring(0, 4) + "-" + targetStr.substring(4, 6) + "-" + targetStr.substring(6, 8);
}

function formatStrTime(targetStrTime) {
    return targetStrTime.substring(0, 2) + ":" + targetStrTime.substring(2, 4);
}