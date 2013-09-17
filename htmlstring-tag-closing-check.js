// author: barton.ding@gmail.com
// time  : 2013-09-17

(function () {

var root = this;

if (root.checkHtmlStringTag) return;

var LINE_BREAK     = '\n';
var TAG_START      = '<';
var TAG_END        = '>';
var ESCAPE_CHAR    = '\\'; // 转义符
var SLASH_CHAR     = '/';

var SINGLE_QUOTES  = "'";
var DOUBLE_QUOTES  = '"';
var SPACE          = ' ';
var TAB            = '\t';

var EVIL_TAG = '-' + ['script', 'style'].join('-') + '-';
var EVIL_END = {'script': '</script>', 'style': '</style>'};

root.checkHtmlStringTag = function (htmlStr) {

    // 是否处于引号中
    var inQuotes = false;
    // 当前引号类型: ' 或 "
    var quotes   = '';

    // tag 相关变量
    var tagStarted    = false;
    var tagString     = '';
    var tagQueues     = [];
    var tagWaitingEnd = false;
    var isTagClosing  = false;

    // 魔鬼模式，指直接过滤 EVIL_TAG 标签中的内容
    var inEvil        = false;
    var evilTag       = '';
    var evilEnd       = '';
    var evilLen       = 0;
    var evilCur       = '';
    var evil_i        = 0;

    // 处于 html 注释状态
    var inHtmlComment = false;
    var commentStart  = '';
    var commentEnd    = '';

    var result = [];
    var line = 1, column = 1;
    // for loop 相关的变量
    var len = htmlStr.length, i = 0;
    var curChar, prevChar, nextChar, otag;

    // var ttt = ''; // todo: comments

    // -------------------------------------------------------------------------
    // for start
    for (; i < len; i++) {
        curChar  = htmlStr.charAt(i);
        prevChar = htmlStr.charAt(i-1);
        nextChar = htmlStr.charAt(i+1);

        // ---------------------------------------------------------------------
        // 行号&列号更新
        column++;
        if (curChar === LINE_BREAK) {
            line++;
            column = 1;
            continue;
        }

        // ---------------------------------------------------------------------
        // 优先处理 html 注释，<!-- content -->
        commentEnd   = curChar + nextChar + htmlStr.charAt(i+2);
        commentStart = commentEnd + htmlStr.charAt(i+3);
        if (commentStart === '<!--') {
            inHtmlComment = true;
            i += 3;
            continue;
        }
        else if (inHtmlComment && commentEnd === '-->') {
            inHtmlComment = false;
            i += 2;
            continue;
        }
        else if (inHtmlComment) { continue; }

        // ---------------------------------------------------------------------
        // 引号，evil 模式等的处理
        if (DOUBLE_QUOTES === curChar || SINGLE_QUOTES === curChar) {
            // 前一个字符为转义符，则跳过
            if (prevChar === ESCAPE_CHAR) continue;
            // 非标签中的引号，则滤过
            if (!tagStarted) continue;

            if (!inQuotes) {
                inQuotes = true;
                quotes   = curChar;
            } else if (quotes === curChar) {
                inQuotes = false;
            }
            continue;
        }
        // 引号中的字符串直接跳过
        else if (inQuotes) { continue; }
        // evil 模式下，除非遇到 EVIL_END，否则一律跳过
        else if (inEvil) {
            evilEnd = EVIL_END[evilTag];
            evilLen = evilEnd.length - 1;
            evilCur = curChar;
            evil_i  = 0;
            while (evil_i++ < evilLen) {
                evilCur += htmlStr.charAt(i + evil_i);
            }
            if (evilEnd === evilCur) {
                inEvil = false;
            } else { continue; }
        }
        else if (TAB === curChar) { continue; }

        // ttt += curChar; // todo: comments

        // ---------------------------------------------------------------------
        // 遇到 "<" 时
        if (TAG_START === curChar) {
            tagStarted = true;
            tagString     = '';
            tagWaitingEnd = false;
            isTagClosing  = false;
            continue;
        }

        // ---------------------------------------------------------------------
        // 遇到 ">" 时
        if (TAG_END === curChar) {
            if (!tagStarted) continue;
            var otag = {
                'line'    : line,
                'column'  : column,
                'tagName' : tagString.toLowerCase(),
                'isEnd'   : isTagClosing
            };
            tagQueues.push(otag);
            // console.log(otag);
            if (EVIL_TAG.indexOf('-'+otag.tagName+'-') > -1) {
                inEvil  = !otag.isEnd;
                evilTag = otag.tagName;
            }
            result = checkQueues(tagQueues);
            if (result.length) break;

            tagString     = '';
            tagStarted    = false;
            tagWaitingEnd = false;
            isTagClosing  = false;
        }

        if (tagWaitingEnd) continue;

        // ---------------------------------------------------------------------
        // 收集 tagName
        if (tagStarted) {
            if (SLASH_CHAR === curChar && TAG_START=== prevChar) {
                isTagClosing = true;
                continue;
            }
            if (SPACE === curChar || TAB === curChar) {
                tagWaitingEnd = true;
                continue;
            }
            tagString += curChar;
        }
    }
    // end for
    // -------------------------------------------------------------------------

    // console.log('filter string: ', ttt); // todo: comments
    // console.log('tagQueues', tagQueues);
    // console.log('result', result);

    return result.length ? result : tagQueues;
};

// 自闭合的标签
var SELF_CLOSING_TAG = '-' + [
    '!doctype', 'img', 'input', 'br', 'meta', 'hr', 'embed', 'wbr', 'base',
    'link', 'area', 'param', 'keygen'
].join('-') + '-';

// 标签队列的检查
function checkQueues(tagQueues) {
    var result = [];
    var len = tagQueues.length;
    var t1 = tagQueues[len - 1];
    // 允许自闭和的标签
    if (SELF_CLOSING_TAG.indexOf('-' + t1.tagName + '-') > -1) {
        tagQueues.pop();
        return result;
    }
    if (!t1.isEnd || len < 2) return result;

    var ct;
    var i = len - 1;
    while (i--) {
        ct = tagQueues[i];
        if (!ct.isEnd && t1.tagName === ct.tagName) {
            if (len - i === 2) {
                tagQueues.pop();
                tagQueues.pop();
            }
            return result;
        }
        result.push(ct);
    }
    return [];
}

}).call(this);