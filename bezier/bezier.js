// 获取线条表达式（y = kx + m）
function getLine (a, b) {
    let k, m;
    k = (a[1] - b[1]) / (a[0] - b[0]);
    m = a[1] - k * a[0];
    return function (x) {
        return k * x + m;
    }
}

// 根据线条数组和当前比例获取点数组
function lines2dots (lines, ratio) {
    return lines.map(line => {
        let { begin, end, lineExp } = line;
        let dotX = begin[0] + (end[0] - begin[0]) * ratio;
        let dotY = lineExp(dotX);
        return [dotX, dotY];
    })
}

// 根据点数组获取下一层的线条数组
function dots2NextLines (dots) {
    return new Array(Object.keys(dots).length - 1).fill(null).map((line, index) => {
        let begin = dots[index], end = dots[index + 1];
        return { begin, end, lineExp: getLine(begin, end) }
    });
}

// 获取根据点数组和当前比例获取最终bezier曲线上的点
function getBezierDot (dots, ratio) {
    let lines = [];
    function reduce () {
        lines = dots2NextLines(dots);
        dots = lines2dots(lines, ratio);
    }
    while (dots.length > 1) {
        reduce();
    }
    return dots[0];
}

// 贝塞尔曲线 dots是设置曲线的点，len表示返回的曲线点数组的个数（数值越大表示曲线越精细）
function bezier (dots, len = 100) {
    if (dots.length < 2) {
        return null;
    }
    let bezierDots = [];

    // 第一层的几条线是不随着比例动的，不需要在循环里计算，把线条数组缓存下来提高性能
    let staticline = dots2NextLines(dots);
    let step = 1 / len;
    for (let ratio = 0; ratio < 1; ratio += step) {
        bezierDots.push(getBezierDot(lines2dots(staticline, ratio), ratio) || dots[0]);
    }
    return bezierDots;
}
