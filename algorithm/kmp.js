// author: barton.ding
// time  : 2013-09-18
//
// Knuth-Morris-Pratt
// 详细说明见 wiki：
// http://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm
//
//  KMP算法是一种改进后的字符串匹配算法，由D.E.Knuth与V.R.Pratt和J.H.Morris同时
//  发现，因此人们称它为克努特——莫里斯——普拉特操作（简称KMP算法）。通过一个辅助
//  函数实现跳过扫描不必要的目标串字符，以达到优化效果。

function kmpSearch(s, w) {
    var m = 0, i = 0,
        pos, cnd, t,
        slen = s.length,
        wlen = w.length;

    /* String to array conversion */
    s = s.split("");
    w = w.split("");

    /* Construct the lookup table */
    t = [-1, 0];
    for ( pos = 2, cnd = 0; pos < wlen; ) {
        if ( w[pos-1] === w[cnd] ) {
            t[pos] = cnd + 1;
            pos++; cnd++;
        }
        else if ( cnd > 0 )
            cnd = t[cnd];
        else
            t[pos++] = 0;
    }
    // console.log(t);

    /* Perform the search */
    while ( m + i < slen ) {
        if ( s[m+i] === w[i] ) {
            i++;
            if ( i === wlen )
                return m;
        }
        else {
            m += i - t[i];
            if ( t[i] > -1 )
                i = t[i];
            else
                i = 0;
        }
    }
    return -1;
}