var canvas   = document.getElementById("c");
var gl       = canvas.getContext("webgl");
var hover_draw = false;
var vertices = [
    // 0.0, 0.0,
    // 0.5, 0.5
];

var colors   = [
    // 0.0, 0.0, 0.0, 1.0,
    // 0.0, 1.0, 0.0, 1.0,
    // 0.0, 1.0, 0.0, 1.0, // testing
    // 0.0, 1.0, 0.0, 1.0  // testing
];

// var triangle = [
//     0.0, 0.0,
//     0.0, -1.0,
//     -1.0, 0.0,
//     -1.0, -1.0,
// ]




function main() {
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var colorAttributeLocation    = gl.getAttribLocation(program, "a_color");

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(colors),
        gl.STATIC_DRAW
    );

    // Keyword referensi : JS mouse event handler
    hover_draw = false;
    canvas.onmousedown = function (e) { line_click_handler(e, gl, canvas) };
    canvas.onmousemove = function (e) { line_hover_handler(e, gl, canvas) };

    drawScene();

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // -- Line --
        // Update vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.STATIC_DRAW
        );

        // Update color buffer
        colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(colors),
            gl.STATIC_DRAW
        );

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var size = 2;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        var size = 4;
        gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);

        var primitiveType = gl.LINES;
        var offset = 0;
        var count = Math.floor(vertices.length / 2);
        gl.drawArrays(primitiveType, offset, count);


        // -- Triangle --
        // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // gl.bufferData(
        //     gl.ARRAY_BUFFER,
        //     new Float32Array(triangle),
        //     gl.STATIC_DRAW
        // );
        // gl.enableVertexAttribArray(positionAttributeLocation);
        //
        //
        // var size = 2;
        // var type = gl.FLOAT;
        // var normalize = false;
        // var stride = 0;
        // var offset = 0;
        // gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
        //
        // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        window.requestAnimationFrame(drawScene);
    }
}




// Line tool event handler
function line_click_handler(e, gl, canvas) {
    var x    = e.clientX;
    var y    = e.clientY;
    var rect = e.target.getBoundingClientRect();

    // Normalisasi antara 0 - 1
    x = (2*(x - rect.left) - canvas.width) / canvas.width;
    y = (canvas.height - 2*(y - rect.top)) / canvas.height;

    if (!hover_draw) {
        vertices.push(x);
        vertices.push(y);

        colors.push(1.0);
        colors.push(1.0);
        colors.push(1.0);
        colors.push(1.0);
    }
    else
        hover_draw = false;
}

function line_hover_handler(e, gl, canvas) {
    var x    = e.clientX;
    var y    = e.clientY;
    var rect = e.target.getBoundingClientRect();

    // Normalisasi antara 0 - 1
    x = (2*(x - rect.left) - canvas.width) / canvas.width;
    y = (canvas.height - 2*(y - rect.top)) / canvas.height;

    if (vertices.length % 4 == 2 && !hover_draw) {
        hover_draw = true;
        vertices.push(x);
        vertices.push(y);

        colors.push(1.0);
        colors.push(1.0);
        colors.push(1.0);
        colors.push(1.0);
    }
    else if (hover_draw) {
        vertices[vertices.length-2] = x;
        vertices[vertices.length-1] = y;
    }
}

// TODO : Tambah, hover opsional
function rectangle_click_handler(e, gl, canvas) {}
function rectangle_hover_handler(e, gl, canvas) {}
function polygon_click_handler(e, gl, canvas) {}
function polygon_hover_handler(e, gl, canvas) {}




// Button event handler
function line_btn_handler() {
    document.getElementById("mode").innerText = "Line tool";
    canvas.onmousedown = function (e) { line_click_handler(e, gl, canvas) };
    canvas.onmousemove = function (e) { line_hover_handler(e, gl, canvas) };
}

function rectangle_btn_handler() {
    document.getElementById("mode").innerText = "Rectangle tool";
    canvas.onmousedown = function (e) { rectangle_click_handler(e, gl, canvas) };
    canvas.onmousemove = function (e) { rectangle_hover_handler(e, gl, canvas) };
}

function polygon_btn_handler() {
    document.getElementById("mode").innerText = "Polygon tool";
    canvas.onmousedown = function (e) { polygon_click_handler(e, gl, canvas) };
    canvas.onmousemove = function (e) { polygon_hover_handler(e, gl, canvas) };
}

function select_btn_handler() {
    document.getElementById("mode").innerText = "Selection tool";
    canvas.onmousedown = null;
    canvas.onmousemove = null;
}

window.onload = main;
