
var canvas;
var index = 0;
class Line {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}
var prev =new Line(0, 0);
var positions = [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 0]
];

function last2bits(x) {
    return (x & 3);
}
function hindex2xy(hindex, N) {
    var tmp = positions[last2bits(hindex)];
    hindex = (hindex >>> 2);
    var x = tmp[0];
    var y = tmp[1];

    for (var n = 4; n <= N; n *= 2) {
        var n2 = n / 2;
        switch (last2bits(hindex)) {
            case 0:                
                tmp = x;
                x = y;
                y = tmp;
                break;
            case 1:
                x = x;
                y = y + n2;
                break;
            case 2:
                x = x + n2;
                y = y + n2;
                break;
            case 3:
                tmp = y;
                y = (n2 - 1) - x;
                x = (n2 - 1) - tmp;
                x = x + n2;
                break;
        }
        hindex = (hindex >>> 2);
    }
    return new Line(x * 5, y * 5)
}
function setup() {
    $("#fps").css("top", "calc( 100% - 20px)")
    canvas = createCanvas($("#canvas").innerWidth(), $("#canvas").innerHeight())
    $("#defaultCanvas0").detach().appendTo("#canvas");
}
function draw() {
    colorMode(HSB, 100);
    stroke(color("hsb(" + Math.round(map(index++, 0, width/5 * width/5, 360, 0) % 360) + ", 100%, 50%)"))
    smooth()
    l = hindex2xy(index, width);
    if(!0 < l.x > width)noLoop()
    line(l.x, l.y, prev.x, prev.y)
    prev = l
    $("#fps").text(Math.round(frameRate()))
}


