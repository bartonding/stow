function heredoc(fn) {
    return fn.toString()
        .replace(/^[^\/]+\/\*!?/, '')
        .replace(/\*\/[^\/]+$/, '');
}

// heredoc test
var testString = heredoc(function(){/*
    <div id="mod-2013-05-27" class="info-mod">
        <h4 class="date newItem info-animated">
            <span class="dict-icon"></span>
            <span class="cur-date">2013-05-27</span>
        </h4>
        <ul class="content">
            <li id="item-2013-05-27421" class="cols-layout">......</li>
        </ul>
    </div>
*/});

