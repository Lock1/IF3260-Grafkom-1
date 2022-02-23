function bind_gl_buffer(gl, gl_buf, src_buf) {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl_buf);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(src_buf),
        gl.STATIC_DRAW
    );
}

function set_bind_ptr_gl(gl, attr_loc, gl_buf, size) {
    gl.enableVertexAttribArray(attr_loc);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl_buf);

    var type      = gl.FLOAT;
    var normalize = false;
    var stride    = 0;
    var offset    = 0;
    gl.vertexAttribPointer(attr_loc, size, type, normalize, stride, offset);
}

function create_program(gl, vtx_src, frg_src) {
    var vtx = document.getElementById(vtx_src).text;
    var vtx_shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vtx_shader, vtx);
    gl.compileShader(vtx_shader);

    var frg = document.getElementById(frg_src).text;
    var frg_shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(frg_shader, frg);
    gl.compileShader(frg_shader);

    var program = gl.createProgram();
    gl.attachShader(program, vtx_shader);
    gl.attachShader(program, frg_shader);
    gl.linkProgram(program);
    return program;
}
