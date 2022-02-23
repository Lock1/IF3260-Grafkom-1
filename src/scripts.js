var canvas   = document.getElementById("c");
var gl       = canvas.getContext("webgl");

var gl_objects = {
    line: {
        vertices: [],
        colors: []
    },

    polygon: {
        shape: [],
        shape_color: []
    },

    rectangle: {
        shape: [],
        shape_color: []
    }
}


var hover_draw_line      = false;
var hover_draw_polygon   = false;
var hover_draw_rectangle = false;

var temp_polygon_vertices = [];
var temp_polygon_colors   = [];

var temp_rectangle_vertices = [];
var temp_rectangle_colors   = [];

var picked_color = [1.0, 1.0, 1.0, 1.0];



function main() {
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader", "fragment-shader"]);
    var selector_program = webglUtils.createProgramFromScripts(gl, ["select-vx-shader", "select-fg-shader"]);
    canvas.addEventListener("keydown", (e) => {console.log(e.keyCode)}); // DEBUG

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var colorAttributeLocation    = gl.getAttribLocation(program, "a_color");

    var positionBuffer = gl.createBuffer();
    var colorBuffer    = gl.createBuffer();

    hover_draw_line = false;
    line_btn_handler();
    drawScene();

    function set_gl_pos_color_buf(vertex_buf, color_buf) {
        bind_gl_buffer(gl, positionBuffer, vertex_buf);
        set_bind_ptr_gl(gl, positionAttributeLocation, positionBuffer, 2);

        bind_gl_buffer(gl, colorBuffer, color_buf);
        set_bind_ptr_gl(gl, colorAttributeLocation, colorBuffer, 4);
    }

    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);

        gl.useProgram(program);
        // -- Line --
        // Update vertex & color buffer
        set_gl_pos_color_buf(gl_objects.line.vertices, gl_objects.line.colors);
        var count = Math.floor(gl_objects.line.vertices.length / 2);
        gl.drawArrays(gl.LINES, 0, count);

        // -- Polygon --
        for (let i = 0; i < gl_objects.polygon.shape.length; i++) {
            set_gl_pos_color_buf(gl_objects.polygon.shape[i], gl_objects.polygon.shape_color[i]);
            var count = Math.floor(gl_objects.polygon.shape[i].length / 2);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, count);
        }

        // -- Rectangle --
        for (let i = 0; i < gl_objects.rectangle.shape.length; i++) {
            set_gl_pos_color_buf(gl_objects.rectangle.shape[i], gl_objects.rectangle.shape_color[i]);
            var count = Math.floor(gl_objects.rectangle.shape[i].length / 2);
            gl.drawArrays(gl.TRIANGLE_FAN, 0, count);
        }

        // -- Temporary Polygon --
        set_gl_pos_color_buf(temp_polygon_vertices, temp_polygon_colors);
        var count = Math.floor(temp_polygon_vertices.length / 2);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, count);

        // -- Temporary Rectangle --
        set_gl_pos_color_buf(temp_rectangle_vertices, temp_rectangle_colors);
        var count = Math.floor(temp_rectangle_vertices.length / 2);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, count);

        window.requestAnimationFrame(drawScene);
    }
}


// Tool event handler
function line_click_handler(e, gl, canvas) {
    var x    = e.clientX;
    var y    = e.clientY;
    var rect = e.target.getBoundingClientRect();

    // Normalisasi antara -1 - 1
    x = (2*(x - rect.left) - canvas.width) / canvas.width;
    y = (canvas.height - 2*(y - rect.top)) / canvas.height;

    if (!hover_draw_line) {
        gl_objects.line.vertices.push(x);
        gl_objects.line.vertices.push(y);

        picked_color.forEach((item, i) => {
            gl_objects.line.colors.push(item);
        });
    }
    else
        hover_draw_line = false;
}

function line_hover_handler(e, gl, canvas) {
    var x    = e.clientX;
    var y    = e.clientY;
    var rect = e.target.getBoundingClientRect();

    // Normalisasi antara -1 - 1
    x = (2*(x - rect.left) - canvas.width) / canvas.width;
    y = (canvas.height - 2*(y - rect.top)) / canvas.height;

    if (gl_objects.line.vertices.length % 4 == 2 && !hover_draw_line) {
        hover_draw_line = true;
        gl_objects.line.vertices.push(x);
        gl_objects.line.vertices.push(y);

        picked_color.forEach((item, i) => {
            gl_objects.line.colors.push(item);
        });
    }
    else if (hover_draw_line) {
        gl_objects.line.vertices[gl_objects.line.vertices.length-2] = x;
        gl_objects.line.vertices[gl_objects.line.vertices.length-1] = y;
    }
}

function rectangle_click_handler(e, gl, canvas) {
    var x    = e.clientX;
    var y    = e.clientY;
    var rect = e.target.getBoundingClientRect();

    // Normalisasi antara -1 - 1
    x = (2*(x - rect.left) - canvas.width) / canvas.width;
    y = (canvas.height - 2*(y - rect.top)) / canvas.height;

    if (!hover_draw_rectangle) {
        temp_rectangle_vertices.push(x);
        temp_rectangle_vertices.push(y);

        picked_color.forEach((item, i) => {
            temp_rectangle_colors.push(item);
        });
    }
    else {
        hover_draw_rectangle = false;
        gl_objects.rectangle.shape.push(temp_rectangle_vertices);
        gl_objects.rectangle.shape_color.push(temp_rectangle_colors);
        temp_rectangle_vertices = [];
        temp_rectangle_colors   = [];
    }

}

function rectangle_hover_handler(e, gl, canvas) {
    var x    = e.clientX;
    var y    = e.clientY;
    var rect = e.target.getBoundingClientRect();

    // Normalisasi antara -1 - 1
    x = (2*(x - rect.left) - canvas.width) / canvas.width;
    y = (canvas.height - 2*(y - rect.top)) / canvas.height;

    if (temp_rectangle_vertices.length % 8 == 2 && !hover_draw_rectangle) {
        hover_draw_rectangle = true;
        var xi = temp_rectangle_vertices[temp_rectangle_vertices.length-2];
        var yi = temp_rectangle_vertices[temp_rectangle_vertices.length-1];
        temp_rectangle_vertices.push(x);
        temp_rectangle_vertices.push(yi);
        temp_rectangle_vertices.push(xi);
        temp_rectangle_vertices.push(yi);
        temp_rectangle_vertices.push(xi);
        temp_rectangle_vertices.push(y);

        temp_rectangle_colors.push(picked_color[0]);
        temp_rectangle_colors.push(picked_color[1]);
        temp_rectangle_colors.push(picked_color[2]);
        temp_rectangle_colors.push(1);
        temp_rectangle_colors.push(picked_color[0]);
        temp_rectangle_colors.push(picked_color[1]);
        temp_rectangle_colors.push(picked_color[2]);
        temp_rectangle_colors.push(1);
        temp_rectangle_colors.push(picked_color[0]);
        temp_rectangle_colors.push(picked_color[1]);
        temp_rectangle_colors.push(picked_color[2]);
        temp_rectangle_colors.push(1);
        temp_rectangle_colors.push(picked_color[0]);
        temp_rectangle_colors.push(picked_color[1]);
        temp_rectangle_colors.push(picked_color[2]);
        temp_rectangle_colors.push(1);
    }
    else if (hover_draw_rectangle) {
        var x0 = temp_rectangle_vertices[temp_rectangle_vertices.length-8];
        var y0 = temp_rectangle_vertices[temp_rectangle_vertices.length-7];
        temp_rectangle_vertices[temp_rectangle_vertices.length-6] = x0;
        temp_rectangle_vertices[temp_rectangle_vertices.length-5] = y;
        temp_rectangle_vertices[temp_rectangle_vertices.length-4] = x;
        temp_rectangle_vertices[temp_rectangle_vertices.length-3] = y;
        temp_rectangle_vertices[temp_rectangle_vertices.length-2] = x;
        temp_rectangle_vertices[temp_rectangle_vertices.length-1] = y0;
    }
}

function polygon_click_handler(e, gl, canvas) {
    var e = e || window.event;
    var btnCode;

    if ('object' === typeof e) {
        btnCode = e.button;

        switch (btnCode) {
        case 0:
            var x    = e.clientX;
            var y    = e.clientY;
            var rect = e.target.getBoundingClientRect();

            // Normalisasi antara -1 - 1
            x = (2*(x - rect.left) - canvas.width) / canvas.width;
            y = (canvas.height - 2*(y - rect.top)) / canvas.height;

            temp_polygon_vertices.push(x);
            temp_polygon_vertices.push(y);

            picked_color.forEach((item, i) => {
                temp_polygon_colors.push(item);
            });

            break;

        case 1:
            break;

        case 2:
            finalize_polygon();
            break;

        }
    }

    if (temp_polygon_vertices.length == 8) {
        let finalize_polygon_btn = document.createElement("button");
        finalize_polygon_btn.innerHTML = "Finalize Polygon";
        finalize_polygon_btn.onclick = function() { finalize_polygon() };
        document.getElementById("polygon_helper").appendChild(finalize_polygon_btn)
    }

}

function polygon_hover_handler(e, gl, canvas) {
    var x    = e.clientX;
    var y    = e.clientY;
    var rect = e.target.getBoundingClientRect();

    // Normalisasi antara -1 - 1
    x = (2*(x - rect.left) - canvas.width) / canvas.width;
    y = (canvas.height - 2*(y - rect.top)) / canvas.height;

    if (temp_polygon_vertices.length == 2 && !hover_draw_polygon) {
        hover_draw_polygon = true;
        temp_polygon_vertices.push(x);
        temp_polygon_vertices.push(y);

        picked_color.forEach((item, i) => {
            temp_polygon_colors.push(item);
        });
    }
    else if (hover_draw_polygon) {
        temp_polygon_vertices[temp_polygon_vertices.length-2] = x;
        temp_polygon_vertices[temp_polygon_vertices.length-1] = y;
    }
}

function finalize_polygon() {
    hover_draw_polygon = false;
    temp_polygon_vertices.pop();
    temp_polygon_vertices.pop();
    for (let i = 0; i < 4; i++)
        temp_polygon_colors.pop();

    gl_objects.polygon.shape.push(temp_polygon_vertices);
    gl_objects.polygon.shape_color.push(temp_polygon_colors);
    temp_polygon_vertices = [];
    temp_polygon_colors   = [];

    document.getElementById("polygon_helper").innerHTML = "";
}



var selection_shape  = -1;
var selection_sh_idx = -1;
var selection_index  = -1;

function select_hover_handler(e, gl, canvas) {
    // var mX = e.clientX - rect.left;
    // var mY = e.clientY - rect.top;
    // const pX = mX * gl.canvas.width / gl.canvas.clientWidth;
    // const pY = gl.canvas.height - mY * gl.canvas.height / gl.canvas.clientHeight - 1;
    // const data = new Uint8Array(4);
    // gl.readPixels(
        //     pX, pY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data
        // );
        // console.log(pX, pY, data);

    // const rect = canvas.getBoundingClientRect();
    // var x  = e.clientX;
    // var y  = e.clientY;
    // x = (2*(x - rect.left) - canvas.width) / canvas.width;
    // y = (canvas.height - 2*(y - rect.top)) / canvas.height;
    //
    // var selection_shape = -1;
    // var selection_index = -1;
    // for (let i = 0; i < gl_objects.line.vertices.length; i += 2) {
    //     if (e_dis(x, y, gl_objects.line.vertices[i], gl_objects.line.vertices[i+1]) < 0.1) {
    //         selection_shape = 0;
    //         selection_index = i;
    //     }
    // }

    if (selection_shape != -1) {
        const rect = canvas.getBoundingClientRect();
        var x  = e.clientX;
        var y  = e.clientY;
        x = (2*(x - rect.left) - canvas.width) / canvas.width;
        y = (canvas.height - 2*(y - rect.top)) / canvas.height;

        switch (selection_shape) {
            case 0:
                gl_objects.line.vertices[selection_index] = x;
                gl_objects.line.vertices[selection_index + 1] = y;
                break;
            case 1:
                gl_objects.rectangle.shape[selection_sh_idx][selection_index] = x;
                gl_objects.rectangle.shape[selection_sh_idx][selection_index + 1] = y;
                break;
            case 2:
                gl_objects.polygon.shape[selection_sh_idx][selection_index] = x;
                gl_objects.polygon.shape[selection_sh_idx][selection_index + 1] = y;
                break;
            default:
                console.log("Selection error");
        }
    }
}

function select_click_handler(e, gl, canvas) {
    const rect = canvas.getBoundingClientRect();
    var x  = e.clientX;
    var y  = e.clientY;
    x = (2*(x - rect.left) - canvas.width) / canvas.width;
    y = (canvas.height - 2*(y - rect.top)) / canvas.height;

    if (selection_shape != -1) {
        selection_shape = -1;
        selection_index = -1;
    }
    else {
        for (let i = 0; selection_shape == -1 && i < gl_objects.line.vertices.length; i += 2) {
            if (e_dis(x, y, gl_objects.line.vertices[i], gl_objects.line.vertices[i+1]) < 0.1) {
                selection_shape = 0;
                selection_index = i;
            }
        }

        for (let i = 0; selection_shape == -1 && i < gl_objects.rectangle.shape.length; i++) {
            for (let j = 0; selection_shape == -1 && j < gl_objects.rectangle.shape[i].length; j++) {
                if (e_dis(x, y, gl_objects.rectangle.shape[i][j], gl_objects.rectangle.shape[i][j+1]) < 0.1) {
                    selection_shape  = 1;
                    selection_sh_idx = i;
                    selection_index  = j;
                }
            }
        }

        for (let i = 0; selection_shape == -1 && i < gl_objects.polygon.shape.length; i++) {
            for (let j = 0; selection_shape == -1 && j < gl_objects.polygon.shape[i].length; j++) {
                if (e_dis(x, y, gl_objects.polygon.shape[i][j], gl_objects.polygon.shape[i][j+1]) < 0.1) {
                    selection_shape  = 2;
                    selection_sh_idx = i;
                    selection_index  = j;
                }
            }
        }
    }
}

function e_dis(a, b, c, d) {
    return Math.sqrt(Math.pow(a - c, 2) + Math.pow(b - d, 2))
}



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
    canvas.onmousedown = function (e) { select_click_handler(e, gl, canvas) };
    canvas.onmousemove = function (e) { select_hover_handler(e, gl, canvas) };
}




const hexToRgb = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))

function getColor() {
    var hex = document.getElementById("color_picker").value;
    rgb = hexToRgb(hex);
    picked_color = [rgb[0]/255, rgb[1]/255, rgb[2]/255, 1.0];
}

function save() {
    var a = document.createElement("a");
    var file = new Blob([JSON.stringify(gl_objects)], {type : "text/plain"});
    a.href = URL.createObjectURL(file);
    a.download = "save_cad.txt";
    a.click();
}

function load() {
    var src = document.getElementById("load_src");
    var reader = new FileReader();

    reader.readAsText(src.files[0]);
    reader.onerror = (e) => {console.log("Load error")};
    reader.onload  = (e) => {
        gl_objects = JSON.parse(e.target.result);
    };
}


window.onload = main;
