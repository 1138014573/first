﻿btc_rmb_ajax = 10;

var widthNumArr = { 'goc': 0.05, 'btc': 10, 'ltc': 0.1, 'lc': 0.005, 'lsk': 0.005, 'eth': 0.5, 'etc': 0.2, 'mtc': 0.002, 'uc': 0.01, 'lbc': 0.002, 'dsc': 0.002, 'lcc': 0.002, 'mac': 0.002, 'tur': 0.002, 'ecf': 0.002, 'osc': 0.002, 'gec': 0.002, 'hxi': 0.002, 'tge': 0.002 ,'dstb': 0.002 };

function badFloat(num, size) {
    if (isNaN(num)) return true;
    num += '';
    if (-1 == num.indexOf('.')) return false;
    var f_arr = num.split('.');
    if (f_arr[1].length > size) {
        return true;
    }
    return false;
}

// 两数相乘精确结果
function accMul(arg1, arg2) { 
	if(arg1 != undefined && arg2 != undefined && arg1 != NaN && arg2 != NaN){
		var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) {}
    try { m += s2.split(".")[1].length } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
	}
    
}
// 两数相除精确结果
function accDiv(arg1, arg2) {
	if(arg1 != undefined && arg2 != undefined && arg1 != NaN && arg2 != NaN){
		var t1 = 0,
        t2 = 0,
        r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) {}
    try { t2 = arg2.toString().split(".")[1].length } catch (e) {}
    with(Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
	}
    
}

//格式化小数
function formatfloat(f, size, add) {
    f = parseFloat(f);
    var set = [];
	if (size == 0) set = [1, 1];
    if (size == 2) set = [100, 0.01];
    if (size == 3) set = [1000, 0.001];
    if (size == 4) set = [10000, 0.0001];
    if (size == 5) set = [100000, 0.00001];
    if (size == 6) set = [1000000, 0.000001];
    if (size == 7) set = [10000000, 0.0000001];
    if (size == 8) set = [100000000, 0.00000001];

    // var ff = Math.floor(f * set[0]) / set[0];
    var ff = accDiv(Math.floor(accMul(f, set[0])), set[0]);
    if (add && f > ff) ff += set[1];
    return ff;
}
//格式化小数
function loanformatfloat(f, size, add) {
    f = parseFloat(f);
    var set;
    if (size == 2) {
        set = [100, 0.01];
    } else if (size == 3) {
        set = [1000, 0.001];
    } else if (size == 5) {
        set = [100000, 0.00001];
    } else {
        return f;
    }
    var ff = Math.round(f * set[0]) / set[0];
    if (add && f > ff) ff += set[1];
    return ff;
}

function Dom(o) {
    return document.getElementById(o)
}

function ua_refresh(userPairs) {
    ua_cny = Dom('ua_cny');

    Dom('ua_cny_over').innerHTML = formatfloat(user.cny_over, 4) + ' 元';
    Dom('ua_cny_lock').innerHTML = formatfloat(user.cny_lock, 4) + ' 元';

    var coinsRmb = {}; // 存放各个币种当前价格
    for (var i in userPairs) {
        Dom('ua_' + userPairs[i] + '_over').innerHTML = formatfloat(user[userPairs[i] + '_over'], 5) + ' ' + userPairs[i].toUpperCase();
        Dom('ua_' + userPairs[i] + '_lock').innerHTML = formatfloat(user[userPairs[i] + '_lock'], 5) + ' ' + userPairs[i].toUpperCase();
    }

    if (btc_rmb_ajax == 10) {
        $.get('/market/coinprice', function(data) {
            var sumPrice = parseFloat(user.cny_lock) + parseFloat(user.cny_over);
            for (var i in userPairs) {
                var name = userPairs[i] + '_cny_rmb';
                var price = parseFloat(data[name]);
                if (price) {
                    sumPrice += (parseFloat(user[userPairs[i] + '_lock']) + parseFloat(user[userPairs[i] + '_over'])) * price;
                }
            }
            ua_cny.innerHTML = formatfloat(sumPrice, 5).toFixed(2);
        }, "json");
        btc_rmb_ajax = 0;
    }
    btc_rmb_ajax++;
}

function btcsum(limit, coin, price_float, number_float) {
    var coArr = coin.split('_');
    $.get('/json/' + coin + '_sum', function(data) {console.log(data);
        for (var type in data) {
            var d = data[type];
            var html = '';
            var idhtml = '';

            for (var i in d) {
                if (limit && i == limit) break;
                var num = parseFloat(d[i].n),
                    width = num * widthNumArr[coArr[0]] > 289 ? 289 : num * widthNumArr[coArr[0]];

                idhtml = '<td class="' + (type == 'buy' ? 'buy' : 'sell') + '" style="width:50px;">' + (type == 'buy' ? '买' : '卖') + '(' + (parseInt(i) + 1) + ')</td>';
                html += '<tr style="position:relative;">' + idhtml + '<td style="padding-left:5px; text-align:left;">￥' + parseFloat(d[i].p) + '</td><td style="padding-left:5px; text-align:left;">' + num + '</td><td style="width:' + width + 'px" style="border:0;" class="' + (type == 'buy' ? 'sell' : 'buy') + 'Span"></td></tr>';
            }
            $('#' + type + 'list').html(html);
            $('#' + coin + '_' + type + 'one').html(typeof d[0] == 'undefined' ? 0 : Number(d[0].p).toFixed(price_float));
        }
        if (data['sale'].length != 0) {
            $('#bpricenice').html(Number(data['sale'][0].p).toFixed(price_float));
            if (user.length != 0) {
                $('#buy_max').html(formatfloat(user['cny_over'] / Number(data['sale'][0].p) - Math.pow(10, -number_float), number_float, 0));
            }
        }
        if (data['buy'].length != 0) {
            $('#spricenice').html(Number(data['buy'][0].p).toFixed(price_float));
        }
        setTimeout("btcsum(" + limit + ",'" + coin + "', " + price_float + ", " + number_float + ")", 30000);
    }, 'json');
}



function btcorder(limit, coin, display, price_float, number_float) {
    $.get('/json/' + coin + '_order', function(d) {
        var html = '';
        for (var i in d.d) {
            if (limit && i > limit) break;
            if (30 == limit) {
                html += '<tr><td>' + d.d[i].t + '</td><!--<td class="' + d.d[i].s + '">' + (d.d[i].s == 'buy' ? '买入' : '卖出') +
                    '</td>--><td class="' + d.d[i].s + '" style="padding-left:5px; text-align:left;">￥' + d.d[i].p + '</td><td style="padding-left:5px; text-align:left;">' + d.d[i].n + '</td></tr>';
            } else {
                html += '<tr><td>' + d.d[i].t + '</td><td class="' + d.d[i].s + '">￥' + d.d[i].p + '</td><td class="tableEnd">Ф ' + d.d[i].n + '</td></tr>';
            }
        }
        $('#orderlist').html(html);
        // 更新价格
        if (typeof d.d[0] == 'undefined') {
            d.d[0] = { "p": '0.0' }
        }
        d.d[0].p = d.d[0].p + '';
        var price = d.d[0].p.split('.');
        var btc_rmb = formatfloat(d.d[0].p, price_float);
        if (price.length == 1) price[1] = '00';
        $('#' + coin + '_rmb_box').html("￥" + price[0] + "<b>." + (price[1].substring(0, price_float)) + "</b>");
        $('#' + coin + '_rmb_new').html(formatfloat(d.d[0].p, price_float));
        $('#' + coin + '_rmb_new').html(formatfloat(d.d[0].p, price_float));
        $('#' + coin + '_min_box').html(d.min);
        $('#' + coin + '_max_box').html(d.max);
        $('#' + coin + '_sum_box').html(formatfloat(d.sum, number_float));
        var zd_rmb = (parseFloat(d.min) + parseFloat(d.max)) / 2;
        zd_rmb = ((btc_rmb - zd_rmb) / zd_rmb * 100).toString().split('.');
        if (typeof zd_rmb[1] == 'undefined') {
            zd_rmb = ['0', '0'];
        }
        $('#' + coin + '_zd_box').html(zd_rmb[0] + '.' + zd_rmb[1].substr(0, 2) + '%');

        document.title = display + d.d[0].p + " | 交易中心-币交所-区块链权益资产交易平台";

        setTimeout("btcorder(" + limit + ",'" + coin + "', '" + display + "', " + price_float + ", " + number_float + ")", 30000);
    }, 'json');
}


function mytrust(type, coin_from, price_float, number_float) {
    $.get('/ajax/mytrust/coin/' + coin_from + '/type/' + type, function(d) {
			
        var html = "";
        var length = d.data.length;
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                if (i % 2 == 0) {
                    html += "<tr bgcolor=\"#E6F0E6\" id='tru" + d.data[i].id + "'> ";
                } else {
                    html += "<tr bgcolor=\"#F5F5F1\" id='tru" + d.data[i].id + "'>";
                }
                if (d.data[i].flag == 'buy') html += "<td class=\"ttbtn\">买</td>";
                else html += "<td class=\"trbtn\">卖</td>";
                html += "<td>￥" + formatfloat(d.data[i].price, price_float, 0) + "</td>";
                html += "<td>" + formatfloat(d.data[i].numberover, number_float, 0) + "</td>";
                html += "<td><a class=\"remove\" href=\"javascript:void(0);\" onclick=\"trustcancel(" + d.data[i].id + "," + type + ", '" + coin_from + "'," + number_float + ")\">撤销</a></td>";
                html += "</tr>";
            }
        } else {
            html = "<tr><td colspan=4>暂无未交易的委托</td></tr>";
        }
        $('#mytrustlist').html(html);
        setTimeout('mytrust(' + type + ', "' + coin_from + '", ' + price_float + ', ' + number_float + ')', 30000);
    }, 'json');
}


function hourprice(t) {
    $.get('/' + t + '_hour_price?t=' + Math.random(), function(d) {
        $('#hour_price').html(d);
        setTimeout("hourprice()", 30000);
    }, 'json');
}

function yestprice(t) {
    var now = new Date();
    datenow = now.getFullYear() + ((now.getMonth() + 1) < 10 ? "0" : "") + (now.getMonth() + 1) + (now.getDate() < 10 ? "0" : "") + now.getDate();
    $.get('/dayprice/' + t + '_' + datenow + '?t=' + Math.random(), function(d) {
        $('#hour_price').html(d);
    }, 'json');
}

function ajaxtrustcancel(id, type) {
    $.get('/ajax/trustcancel/id/' + id + '/type/' + type, function(d) {
        alert(d.msg);
        if (d.status) {
            $('#t_s_' + id).addClass('cancel');
            $('#t_s_' + id).html('已撤销');
            $('#t_opt_' + id).html('');
        }
    }, 'json');
}

function trustcancel(id, type, coin_from, number_float) {
    $.get('/ajax/trustcancel/id/' + id + '/type/' + type, function(d) {
        $('#tErrorTips').html(d.msg).show();
        if (d.status) {

            /*快速刷新撤销*/
            //clallRefresh();
           // setTimeout(function() {
                function in_array(needle, array, bool) {
                    if (typeof needle == "string" || typeof needle == "number") {
                        for (var i in array) {
                            if (needle === array[i]) {
                                if (bool) { //如果有第三个参数，就返回在数组中的位置
                                    return i;
                                }
                                return true;
                            }
                        }
                        return false;
                    }
                }
                var isType = $('#tru' + id + ' td:eq(0)').html() == '买' ? 'b' : 's';
                var isPrice = $('#tru' + id + ' td:eq(1)').html().substring(1);
                var isNumber = $('#tru' + id + ' td:eq(2)').html();
                var ids = (isType == 'b') ? 'buylist' : 'salelist';
                var isPrices = [];
                var isNumbers = [];
                var tdClass = (isType == 'b') ? 'sellSpan' : 'buySpan';
                $('#' + ids + ' tr td:contains("￥")').each(function(i, e) {
                    isPrices.push(e.innerHTML.substring(1));
                });
                $('#' + ids + ' tr td.' + tdClass).prev().each(function(i, e) {
                    isNumbers.push(e.innerHTML);
                });
                var inx = in_array(isPrice, isPrices, true);
                if (Number(isNumbers[inx]) - Number(isNumber) == 0) {
                    isNumbers.splice(inx, 1);
                    isPrices.splice(inx, 1);
                } else {
                    isNumbers[inx] = Number(isNumbers[inx]) - Number(isNumber);
                    isPrices[inx] = isPrice;
                }
                
                var isInOut = (isType == 'b') ? '买' : '卖';
                var isClass = (isType == 'b') ? 'buy' : 'sell';
                $('#' + ids).html('');
                
                for (var p = 0, n = 0; p < isPrices.length, n < isNumbers.length; p++, n++) {
                  
                    var html = '<tr style="position:relative;"><td class="' + isClass + '" style="width:50px;">' + isInOut + '(' + (p + 1) + ')</td><td style="padding-left:5px; text-align:left;">￥' + isPrices[p] + '</td><td style="padding-left:5px; text-align:left;">' + isNumbers[n] + '</td><td style="width:0.4px" class="sellSpan"></td></tr>';
                    $('#' + ids).append(html);
                }
            //}, 600);

            /*快速刷新撤销*/
            /* console.log(isPrices);
             console.log(isNumbers);*/
            $('#tru' + id).remove();
            for (var i in d.data) user[i] = d.data[i];

            freshAsset(user, coin_from, number_float);

            setTimeout(function() {
                $('#tErrorTips').hide();
            }, 2000);
        }
    }, 'json');
}

// 更新资产
function freshAsset(user, coin, number_float) {
    var bprice = parseFloat($('#bpricenice').html());
    $('#buy_max').html(formatfloat(user['cny_over'] / bprice, number_float, 0));
    $('#sell_max').html(formatfloat(user[coin + '_over'], number_float, 0));

    $('#header_over_cny').html(parseFloat(user['cny_over']));
    $('#header_over_' + coin).html(parseFloat(user[coin + '_over']));
    $('#header_lock_cny').html(parseFloat(user['cny_lock']));
    $('#header_lock_' + coin).html(parseFloat(user[coin + '_lock']));
}

function html5_save() {
    var uuid = getCookie('BJSUUID');
    if (window.localStorage && !localStorage.getItem('BJSUUID')) {
        localStorage.setItem('BJSUUID', uuid);
    } else if (window.localStorage && localStorage.getItem('BJSUUID')) {
        var luuid = localStorage.getItem('BJSUUID');
        //SetCookie('UUID',luuid);
    }
    if (window.sessionStorage && !sessionStorage.getItem('BJSUUID')) {
        sessionStorage.setItem('BJSUUID', uuid);
    } else if (window.sessionStorage && sessionStorage.getItem('BJSUUID')) {
        var suuid = sessionStorage.getItem('BJSUUID');
    }
    //getUrl(luuid,suuid);
}

function getCookie(objName) {
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);
    }
}

function delCookie(name) {
    document.cookie = name + "=;expires=" + (new Date(0)).toGMTString();
}

function SetCookie(name, value) {
    var Days = 30; //此 cookie 将被保存 30 天
    var exp = new Date(); //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + 31536000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function addCookie(objName, objValue, objHours) {
    var str = objName + "=" + escape(objValue);
    if (objHours > 0) { //为时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = 31536000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}
/* function getUrl(luuid,suuid){
    $.get("/?l="+luuid+"&s"+suuid);
}  */
function sendmsg(obj, type, name) {
    if ($(obj).attr('class') == 'aButton2')
        return;
    $.post("/ajax/sendmsg", { type: type, name: name }, function(data) {
        if (data == 1) {
            time(obj);
            $('#errorTips').hide();
            return false;
        }
        if (data == 0) {
            $('#errorTips').html('请您过60秒再点击发送').show();
        }
        if (data == 3) {
            if (type == 1) {
                $('#errorTips').html('您没有足够多的人民币').show();
            }
            if (type == 2) {
                $('#errorTips').html('您没有足够多的富途币').show();
            }
        }
        if (data == 4) {
            $('#errorTips').html('短信过于频繁，请使用语音验证码').show();
        }
        if (data == 2) {
            $('#errorTips').html('您的手机号为空或错误，请联系客服。').show();
        }
        if (data == 22) {
            $('#errorTips').html('1小时内发送次数超过限制，请稍后发送').show();
        }
        if (data == 33) {
            $('#errorTips').html('发送频率过快，请稍后发送').show();
        }
    });
    return;
}
var wait = 60;

function time(obj) {
    if (wait == 0) {
        //$(obj).removeClass('aButton2').addClass('aButton1');
        $(".aButton2").removeClass('aButton2').addClass('aButton1');
        $(obj).html("重新获取验证码");
        wait = 60;
    } else {
        //$(obj).removeClass('aButton1').addClass('aButton2');
        $(".aButton1").removeClass('aButton1').addClass('aButton2');
        $(obj).html("重新发送(" + wait + ")");
        wait--;
        setTimeout(function() {
                time(obj);
            },
            1000)
    }
}
$(function() {
    var wait = $('#time').val();

    function time1(obj) {
        if (wait == 0) {
            //$(obj).removeClass('aButton2').addClass('aButton1');
            $(".aButton2").removeClass('aButton2').addClass('aButton1');
            $(obj).html("重新获取验证码");
            wait = 100;
        } else {
            //$(obj).removeClass('aButton1').addClass('aButton2');
            $(".aButton1").removeClass('aButton1').addClass('aButton2');
            $(obj).html("重新发送(" + wait + ")");
            wait--;
            setTimeout(function() {
                    time1(obj);
                },
                1000)
        }
    }
    if (wait > 0) {
        time1($('.aButton1'));
    }
});


// 首页实时刷新币种信息
function getCoinInfo(pairs) {
    $.get('/index/infofresh', { pairs: pairs }, function(data) {
        for (var i in data) {
            data[i] = eval('(' + data[i] + ')');

            if (data[i].now_price) {
                $("#price_today_ul a[rel='" + i + "'] dd:eq(0)").html('￥' + formatfloat(data[i].now_price, data[i].price_float, 0));
            } else {
                $("#price_today_ul a[rel='" + i + "'] dd:eq(0)").html('0');
            }

            if (data[i].day_total) {
                $("#price_today_ul a[rel='" + i + "'] dd:eq(1)").html(formatfloat(data[i].day_total, data[i].number_float, 0));
                $("#price_today_ul a[rel='" + i + "'] dd:eq(2)").html(formatfloat(data[i].day_money, data[i].price_float, 0));
            } else {
                $("#price_today_ul a[rel='" + i + "'] dd:eq(1)").html('0');
                $("#price_today_ul a[rel='" + i + "'] dd:eq(2)").html('0');
            }

            if (data[i].total_money) {
                $("#price_today_ul a[rel='" + i + "'] dd:eq(3)").html('￥' + formatfloat(data[i].total_money, data[i].price_float, 0));
            } else {
                $("#price_today_ul a[rel='" + i + "'] dd:eq(3)").html('0');
            }

            if (data[i].day_float > 0) {
                $("#price_today_ul a[rel='" + i + "'] dd:eq(4)").attr('class', 'green').html('+' + formatfloat(data[i].day_float * 100, 2, 0) + '%');
            } else {
                $("#price_today_ul a[rel='" + i + "'] dd:eq(4)").attr('class', 'red').html(formatfloat(data[i].day_float * 100, 2, 0) + '%');
            }
            if (data[i].week_float > 0) {
                $("#price_today_ul a[rel='" + i + "'] dd:eq(5)").attr('class', 'green').html('+' + formatfloat(data[i].week_float * 100, 2, 0) + '%');
            } else {
                $("#price_today_ul a[rel='" + i + "'] dd:eq(5)").attr('class', 'red').html(formatfloat(data[i].week_float * 100, 2, 0) + '%');
            }
        }
        setTimeout("getCoinInfo('" + pairs + "')", 6000);
    }, "json");
}
