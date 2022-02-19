var vertices = [
    0.0, 0.0,
    0.5, 0.5
];

var colors   = [
    0.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0
];


function main() {
    var canvas  = document.getElementById("c");
    var gl      = canvas.getContext("webgl");
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
    canvas.onmousedown = function (e) { click_handler(e, gl, canvas) };
    // canvas.onmousemove = function (e) { hover_handler(e, gl, canvas) }; // TODO : Extra, Bonus

    drawScene();

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Updating vertex buffer
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

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);

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
        window.requestAnimationFrame(drawScene);
    }

    function click_handler(e, gl, canvas) {
        var x    = e.clientX;
        var y    = e.clientY;
        var rect = e.target.getBoundingClientRect();

        // Normalisasi antara 0 - 1
        x = (2*(x - rect.left) - canvas.width) / canvas.width;
        y = (canvas.height - 2*(y - rect.top)) / canvas.height;

        vertices.push(x);
        vertices.push(y);

        colors.push(1.0);
        colors.push(0.0);
        colors.push(0.0);
        colors.push(1.0);
    }

    function hover_handler(e, gl, canvas) {
        var x    = e.clientX;
        var y    = e.clientY;
        var rect = e.target.getBoundingClientRect();

        // Normalisasi antara 0 - 1
        x = (2*(x - rect.left) - canvas.width) / canvas.width;
        y = (canvas.height - 2*(y - rect.top)) / canvas.height;

        vertices[2] = x;
        vertices[3] = y;
    }
}




main();
