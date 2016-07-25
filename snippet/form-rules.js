(function () {
/**
 * 表单验证的一些规则
 */
var rules = {
    noEmpty: function(v){
        if(v.length === 0){
            return false;
        }
        return true;
    },
    email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g,
    // 163 Email可以允许Email没有后面的@符号
    email163: /(^\w+([-+.]\w+)*$)|(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/g,
    phone: /^1\d{10}$/g, // 手机
    telphone: /^(\d{3}-)?\d{7,8}$|^(\d{4}-)?\d{7,8}$/g, // 座机
    qq: /^[1-9][0-9]{4,}$/g,
    postCode: /^[1-9]\d{5}(?!\d)$/g, //邮编
    IDs: /^\d{15}|\d{18}$/g, // 省份证
    cnChars: /^[\u4e00-\u9fa5]+$/g, // 汉字
    doubleByte: /[^\x00-\xff]/g, // 双字节
    url: /^(http(s)?:\/\/)?[^\s:]+[.][^\s:]+(:\d+)?/g,
    number: /^\d+$/g,
    CH2_8: function(v){
        v = v.replace(/[\u4e00-\u9fa5]/g, 'xx');
        if(v.length < 4 || v.length > 16){
            return false;
        }
        return true;
    },
    CH16: function(v){
        v = v.replace(/[\u4e00-\u9fa5]/g, 'xx');
        if(v.length > 32){
            return false;
        }
        return true;
    },
    min6: function(v){
        return v.length >= 6;
    },
    doCheck: function(r, str){
        if(this[r]){
            if($.isFunction(this[r])){
                return this[r](str);
            }else{
                this[r].lastIndex = 0;
                return this[r].test(str);
            }
        }
        return false;
    }
};

/**
 * 身份证证的严格认证
 */
var IdentityCard = (function(){
    // 15位和18位省份证的基本验证规则，不包括对出生日期和校检码的验证
    var baseRegexp = /^[1-9]((\d{14})|(\d{16}(\d|x)))$/gi,
    // 第18位校验码的计算系数，数组中的每个数字分别对应于身份证的前17位
    coefficient18 = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
    // 第18位校验码基于系数计算所得的余数，在此对照表中查找第18位的值
    referMap18 = ['1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2'],
    // 存放身份证号码的数组，存成数组便于计算
    idArr = [],
    // 当前年龄的时间戳
    currOld = new Date().getTime(),
    // 100年前的时间戳
    maxOld = currOld - 100*365*24*60*60*1000;

    /**
     * 对于18位的身份证号，计算第18位的值
     */
    var calculateV18 = function(){
        var sum = 0;
        for(var i=0, l=coefficient18.length; i<l; i++){
            sum += coefficient18[i]*idArr[i];
        }
        return referMap18[sum%11];
    },
    // 把身份证号转为数组
    transToArr = function(idc){
        return idc.match(/\d|x/gi);
    },
    // 由年-月 获取 当月天数，主要涉及到闰年2月的问题
    getCountDays = function(y, m){
        var isLeapYear = function (year){
                return ((year %4==0 && year %100!=0) || (year %400==0))? true : false ;
            },
            ma = [31,28,31,30,31,30,31,31,30,31,30,31];
        if(m == 2 && isLeapYear(y)){
            return 29;
        }
        return ma[m-1];
    },
    // 检查出生日期
    checkOld = function(){
        var y, m, d, cd = new Date();
        if(idArr.length === 18){
            y = idArr.slice(6,10).join('') - 0;
            m = idArr.slice(10,12).join('') - 0;
            d = idArr.slice(12,14).join('') - 0;
        }else{
            y = '19'+idArr.slice(6,8).join('') - 0;
            m = idArr.slice(8,10).join('') - 0;
            d = idArr.slice(10,12).join('') - 0;
        }
        // 检查年份和月份
        if(y === 0 || m === 0 || d === 0 || y > cd.getFullYear() || m > 12){
            return false;
        }
        // 日期大于给定的年-月对应的天数
        if(d > getCountDays(y, m)){
            return false;
        }
        cd.setFullYear(y);
        cd.setMonth(m-1);
        cd.setDate(d);
        // 你不可能刚出生，也不可能100岁，除非你非地球人，这里不欢迎你，sorry
        if(cd.getTime() >= currOld || cd.getTime() < maxOld){
            return false;
        }
        return true;
    };
    /**
     * 判断身份证号是否合法
     */
     function checkIdentityCard(identcd){
        identcd = identcd.toLowerCase();
        // 正则表达式索引归零
        baseRegexp.lastIndex = 0;
        // 基本格式有误
        if(!baseRegexp.test(identcd)){
            return false;
        }
        // 将身份证字符串转换为数组
        idArr = transToArr(identcd);

        // 18位身份证须验证最后一位的校验码
        if(idArr.length === 18){
            if(idArr[idArr.length - 1] !== calculateV18()){
                return false;
            }
        }
        // 检查出生日期是否正确
        if(!checkOld()) return false;

        return true;
     }

    return {
        'check': checkIdentityCard
    };
})();

rules['strictIDs'] = IdentityCard.check;

window.FormRules = rules;

})();