function main() {
    var gl      = document.getElementById("c").getContext("webgl");
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var colorAttributeLocation    = gl.getAttribLocation(program, "a_color");
    var translationLocation       = gl.getUniformLocation(program, "u_translation");
    var resolutionLocation        = gl.getUniformLocation(program, "u_resolution");

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setColors(gl);

    var resolution  = [1000, 1000];
    var translation = [100, 100];

    drawScene();

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

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

        gl.uniform2fv(translationLocation, translation);
        gl.uniform2fv(resolutionLocation, resolution);

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 18;
        gl.drawArrays(primitiveType, offset, count);
    }
}


function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,

            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,

            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90,
        ]),
        gl.STATIC_DRAW
    );
}

function setColors(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,

            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,

            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1,
            0.1, 0.2, 0.8, 1
        ]),
        gl.STATIC_DRAW
    );
}


main();
