/*
    Authors:
    - Daniel Marques 85070
    - Tomás Freitas  84957
*/
var SHADERS = {
    _Pmatrix: null,
    _Vmatrix: null,
    _Mmatrix: null,
    _sampler: null,
    _uv: null,
    _position: null,
    _normal: null,

    initialize: function(GL) {

        // Vertex Shader
        var shaderVertexSource = "\n\
            attribute vec3 position;\n\
            attribute vec2 uv;\n\
            attribute vec3 normal;\n\
            uniform mat4 Pmatrix;\n\
            uniform mat4 Vmatrix;\n\
            uniform mat4 Mmatrix;\n\
            varying vec2 vUV;\n\
            varying vec3 vNormal;\n\
            varying vec3 vView;\n\
            void main(void) { //pre-built function\n\
            gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
            gl_PointSize = 2.0;\n\
            vNormal=vec3(Mmatrix*vec4(normal, 0.));\n\
            vView=vec3(Vmatrix*Mmatrix*vec4(position, 1.));\n\
            vUV=uv;\n\
            }";

        // Fragment Shader
        var shaderFragmentSource = "\n\
            precision mediump float;\n\
            uniform sampler2D sampler;\n\
            varying vec2 vUV;\n\
            varying vec3 vNormal;\n\
            varying vec3 vView;\n\
            const vec3 source_ambient_color=vec3(0.4,0.4,0.4);\n\
            const vec3 source_diffuse_color=vec3(" + redL + "," + greenL + "," + blueL + ");\n\
            const vec3 source_specular_color=vec3(0.,0.,0.);\n\
            const vec3 source_direction=vec3(" + xxL + "," + yyL + "," + zzL + ");\n\
            \n\
            const vec3 mat_ambient_color=vec3(0.3,0.3,0.3);\n\
            const vec3 mat_diffuse_color=vec3(1.,1.,1.);\n\
            const vec3 mat_specular_color=vec3(1.,1.,1.);\n\
            const float mat_shininess=10.;\n\
            \n\
            \n\
            \n\
            void main(void) {\n\
            vec3 color=vec3(texture2D(sampler, vUV));\n\
            vec3 I_ambient=source_ambient_color*mat_ambient_color;\n\
            vec3 I_diffuse=source_diffuse_color*mat_diffuse_color*max(0., dot(vNormal, source_direction));\n\
            vec3 V=normalize(vView);\n\
            vec3 R=reflect(source_direction, vNormal);\n\
            \n\
            \n\
            vec3 I_specular=source_specular_color*mat_specular_color*pow(max(dot(R,V),0.), mat_shininess);\n\
            vec3 I=I_ambient+I_diffuse+I_specular;\n\
            gl_FragColor = vec4(I*color, 1.);\n\
            }";

        var getShader = function(source, type, typeString) { // Shader compiler
            var shader = GL.createShader(type);
            GL.shaderSource(shader, source);
            GL.compileShader(shader);
            if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
                alert("ERROR IN " + typeString + " SHADER : " + GL.getShaderInfoLog(shader));
                return false;
            }
            return shader;
        };

        var shaderVertex = getShader(shaderVertexSource, GL.VERTEX_SHADER, "VERTEX"); // Vertex shader compilation
        var shaderFragment = getShader(shaderFragmentSource, GL.FRAGMENT_SHADER, "FRAGMENT"); // Fragment shader compilation

        var SHADER_PROGRAM = GL.createProgram();

        GL.attachShader(SHADER_PROGRAM, shaderVertex);
        GL.attachShader(SHADER_PROGRAM, shaderFragment);

        GL.linkProgram(SHADER_PROGRAM);

        SHADERS._Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix"); // Pointer to the projection matrix
        SHADERS._Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix"); // Pointer to the view matrix
        SHADERS._Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix"); // Pointer to the model matrix

        SHADERS._sampler = GL.getUniformLocation(SHADER_PROGRAM, "sampler");
        SHADERS._uv = GL.getAttribLocation(SHADER_PROGRAM, "uv"); // Pointer to the texture coordinates variable
        SHADERS._position = GL.getAttribLocation(SHADER_PROGRAM, "position"); // Pointer to the position variable
        SHADERS._normal = GL.getAttribLocation(SHADER_PROGRAM, "normal"); // Pointer to the normal coordinates variable

        GL.enableVertexAttribArray(SHADERS._uv); // Enable uv
        GL.enableVertexAttribArray(SHADERS._position); // Enable position
        GL.enableVertexAttribArray(SHADERS._normal); // Enable normal

        GL.useProgram(SHADER_PROGRAM);
        GL.uniform1i(SHADERS._sampler, 0); // Texture channel number 0
    }
};