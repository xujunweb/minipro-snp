function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

function GetTime(str,format){
    var date = new Date(str);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate()<10? '0'+(date.getDate()):date.getDate();
    var hh = (parseInt(date.getHours())>9?date.getHours():'0'+date.getHours()) + ':';
    var mm = (parseInt(date.getMinutes())>9?date.getMinutes():"0"+date.getMinutes()) + ':';
    var mmEnd =(parseInt(date.getMinutes())>9?date.getMinutes():"0"+date.getMinutes());
    var ss = parseInt(date.getSeconds())>9?date.getSeconds():'0'+date.getSeconds();

    if(format) {
        if (format == 'Y-M-D hh:mm:ss') {
            return Y + M + D + " " + hh + mm + ss;
        }
        else if (format == 'Y-M-D hh:mm') {
            return Y + M + D + " " + hh + mmEnd;
        }
        else {
            return Y + M + D
        }
    }
    else {
        return Y + M + D
    }
}

function formatMoney(money) {

  if (money == 0) return '0.00';
  money = money/100;
  money = (+money).toFixed(2);
  return money;
}

function formatMoney2(money) {
  if (money == 0) return 0;
  money = money/100;
  money = (+money);
  return money.toString();
}

/**
 * 价格格式化：有分的格式化2位，无分有角格式化1位，无分无角格式化0位
 */
function formatMoney3(money){

  if (money % 100 == 0) return money / 100;

  if (money % 10 == 0) return (money/100).toFixed(1)

  return (money/100).toFixed(2);
}

//获取当前时间格式
function formatTimeLayout(date) {
  var date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
} 

//处理IM返回的用户信息
function handleArryToObject(arry){
  var obj = {}
  for(let i =0,item;item=arry[i];i++){
    obj[item.To_Account] = {}
    for (let k = 0, list; list = item.ProfileItem[k];k++){
      obj[item.To_Account][list.Tag] = list.Value
    }
  }
  return obj
}


module.exports = {
  formatTime:formatTime,
  formatLocation:formatLocation,
  GetTime:GetTime,
  formatMoney,
  formatMoney2,
  formatMoney3,
  formatTimeLayout,
  handleArryToObject
};