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
