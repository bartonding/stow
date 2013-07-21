// -----------------------------------------------------------------------------
// XMLHttpRequest 对象的方法

// abort()
// 停止当前请求
//
// getAllResponseHeaders()
// 把HTTP请求的所有响应首部作为键/值对返回
//
// getResponseHeader("header")
// 返回指定首部的串值
//
// open("method", "url")
// 建立对服务器的调用。method参数可以是GET、POST或PUT。url参数可以是相对URL
// 或绝对URL。这个方法还包括3个可选的参数
//
// send(content)
// 向服务器发送请求
//
// setRequestHeader("header", "value")
// 把指定首部设置为所提供的值。在设置任何首部之前必须先调用open()
//
// -----------------------------------------------------------------------------
// XMLHttpRequest 对象的属性
// onreadystatechange
// 每个状态改变时都会触发这个事件处理器，通常会调用一个JavaScript函数
//
// readyState
// 请求的状态。有5个可取值：0 = 未初始化，1 = 正在加载，2 = 已加载，3 = 交互中，4 = 完成
//
// responseText
// 服务器的响应，表示为一个串
//
// responseXML
// 服务器的响应，表示为XML。这个对象可以解析为一个DOM对象
//
// status
// 服务器的HTTP状态码（200对应OK，404对应Not Found（未找到），等等）
//
// statusText
// HTTP状态码的相应文本（OK或Not Found（未找到）等等）

var xhr = window.XMLHttpRequest
            ? new XMLHttpRequest()
            : new ActiveXObject("Microsoft.XMLHTTP");
// method: get | post | ...
// URL
// flag: default true，true：异步，false：同步
// 指定的url需要登录是，需要指定 name & password
// xhr.open(method, URL, flag, name, password)
xhr.open('GET', 'http://www.youdao.com', true);
// 如果是post请求，需要重新设置编码格式，这样可以通知服务器当前的请求的格式
// 符合UTF-8的编码
// xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

// 每当 readyState 属性改变时，就会调用该函数
xhr.onreadystatechange = function () {
    if (
        xhr.status = 200 &&
        // 0: 请求未初始化
        // 1: 服务器连接已建立
        // 2: 请求已接收
        // 3: 请求处理中
        // 4: 请求已完成，且响应已就绪
        xhr.readyState = 4
    ) {
        // todo
        // xhr.responseText || xhr.responseXML
    }
};

// xhr.send("b=12&c=1");
xhr.send(null);