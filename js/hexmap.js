var topology;
var projection;
var path;
var svg;
var zoom;

var numHexX = 10;
var map;
var width;
var radius;
var height;

function calcSizes(){
    map = d3.select("#map").node();
    width = map.clientWidth - 20; //window.innerWidth;
    height = width * 9 / 16;
    radius = width / (numHexX * 3 + 0.5);
    var dy = radius * 2 * Math.sin(Math.PI / 3);
    height = Math.ceil(height / dy) * dy;
}

function render(){
    d3.select("#svg_1")
        .attr("width", width)
        .attr("height", height);
    d3.select("#rect_1")
        .attr("width", width)
        .attr("height", height);
    d3.select("#img_1")
        .attr("width", width)
        .attr("height", height);

    var hexes = CalcHex(radius, width, height);
    
    d3.selectAll('path').remove();

    svg.attr("class", "hexagon")
        .selectAll("path")
        .data(hexes.id)
        .enter()
        .append("path")
        .attr("d", function(d) { return hexes.d[d]; })
        .attr("class", "red")
        .on("click", click);

    svg.exit().remove();
}

function hexmapOnLoad(){
    calcSizes();

    svg = d3.select("#map")
        .append("svg:svg")
        .attr("id","svg_1")
        .attr("width", width)
        .attr("height", height)
        .attr("pointer-events", "all")
        .call(zoom = d3.zoom().on("zoom", rescale))
        .on("dblclick.zoom", null)
        .append("svg:g");

    svg.append("svg:rect")
        .attr("id","rect_1")
        .attr("width", width)
        .attr("heigh", height)
        .attr("fill", 'none');

    svg.append("image")
        .attr("id","img_1")
        .attr("xlink:href", "./images/mars.jpg")
        .attr("width", width)
        .attr("height", height)
        .attr("preserveAspectRatio", "none");
    
    render();
}

function CalcHex(radius, width, height) {
    var dy = radius * 2 * Math.sin(Math.PI / 3);
    var dx = radius * 3;

    var n = numHexX;//Math.floor(width / (radius * 3.5));
    var m = Math.floor(height / dy) * 2 - 1;

    var vertex = [
        [0.5, -0.866],
        [-0.5, -0.866],
        [-1, 0],
        [-0.5, 0.866],
        [0.5, 0.866],
        [1, 0]
    ];

    var vector = [];
    var ids = [];
    var count = 0;

    for (var y = 0; y < m; y++){
        for (var x = 0; x < n; x++){
            var movX = x * dx + (y & 1) * dx / 2 + radius;
            var movY = y * dy / 2 + dy / 2;

            var points = " M " + (vertex[0][0] * radius + movX) + " " + (vertex[0][1] * radius + movY);
            for (var i = 1; i < 6; i++){
                points += " L " + (vertex[i][0] * radius + movX) + " " + (vertex[i][1] * radius + movY);
            }
            points += " L " + (vertex[0][0] * radius + movX) + " " + (vertex[0][1] * radius + movY);

            vector.push(points);
            ids.push([count++]);
        }
    }

    return {
        d: vector,
        id: ids
    };
}

window.onresize = function(){
    calcSizes();
    
    render();
}

/**
* rescale:
* rescale main svg(vis)
*
* Global variables:
* oldTrans
*/
function rescale(){
    transform = d3.event.transform;

    /* do not let the user to zoom out beyond initial scale */
    if (transform.k < 1) {
        transform.k = 1;
        //zoom.transform(transform);
    }

    /* a scala 2, il transform e' a -((width * scala) - width) */
    var limitX = -((width * transform.k) - width);
    var limitY = -((height * transform.k) - height);

    /* calc boundaries */
    if (transform.x > 0){
        transform.x = 0;
    } else if (transform.x < limitX){
        transform.x = limitX;
    }

    if (transform.y > 0){
        transform.y = 0;
    } else if (transform.y < limitY){
        transform.y = limitY;
    }

    svg.attr("transform", transform);
    //zoom.transform(transform);
}

function click(d) {
    d3.select(this).classed("red", !d.fill);
    d3.select(this).classed("blue", d.fill);
    d.fill = !d.fill;
}
