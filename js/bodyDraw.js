/*
    Authors:
    - Daniel Marques 85070
    - Tomás Freitas  84957
*/
function Body(distance, translation, rotation, radius, stoppable) {
    this.vertex = null;
    this.faces = null;
    this.VERTEX = null;
    this.FACES = null;
    this.texture = null;
    this.distance = distance;
    this.translation = translation;
    this.rotation = rotation;
    this.radius = radius;
    this.rotRotation = 0;
    this.rotTranslation = 0;
    this.satelites = [];
    this.stack = null;
    this.stoppable = stoppable;

    this.addSatelite = function(satelite) {
        this.satelites.push(satelite);
    };

    this.model = function(GL, radius, textureURL) {

        this.vertex = SPHERE.getSphereVertex(radius, 32); // vertex array
        this.faces = SPHERE.getShereFaces(32); // Faces array

        this.VERTEX = GL.createBuffer(); // Vertex Buffer Object of vertex
        GL.bindBuffer(GL.ARRAY_BUFFER, this.VERTEX); // Vertex bind
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex), GL.STATIC_DRAW); // Values assign

        this.FACES = GL.createBuffer(); // Vertex Buffer Object of faces
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.FACES); // Faces bind
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faces), GL.STATIC_DRAW); // Values assign

        this.texture = TEXTURE.getTexture(GL, textureURL); // Texture generation
    };

    this.draw = function(GL, stack) {

        this.stack = new Stack(); // Create new stack
        this.stack.copy(stack); // Previous values are copied

        // Auxiliary matrices for each of the transformations
        var MATRIX_TRA = MATHS.getI4();
        var MATRIX_DIS = MATHS.getI4();
        var MATRIX_ROT = MATHS.getI4();

        // Translation
        if (!this.stoppable || !pause) {
            this.rotTranslation += this.translation;
        }
        MATHS.rotateY(MATRIX_TRA, this.rotTranslation); // Rotate over your reference body
        this.stack.add(MATRIX_TRA); // Add to translation stack

        // Distance
        MATHS.translateZ(MATRIX_DIS, this.distance); // Moves to its orbiting position (distance)
        this.stack.add(MATRIX_DIS); // Add to distance stack

        // Satellites
        for (var i = 0; i < this.satelites.length; i++) {
            this.satelites[i].draw(GL, this.stack); // Draw each satellite
        }

        // Rotation
        this.rotRotation += this.rotation; // Increase the angle of rotation on itself
        MATHS.rotateY(MATRIX_ROT, this.rotRotation); // Rotation on itself
        this.stack.add(MATRIX_ROT); // Add to rotation stack

        var MATRIX = this.stack.evaluate(); // The value of the matrix is the stack evaluation

        GL.uniformMatrix4fv(SHADERS._Mmatrix, false, MATRIX); // Model matrix is ​​assigned

        if (this.texture.webglTexture) { // If gets texture
            GL.activeTexture(GL.TEXTURE0); // Texture is activated
            GL.bindTexture(GL.TEXTURE_2D, this.texture.webglTexture); // Texture is binded
        }

        GL.bindBuffer(GL.ARRAY_BUFFER, this.VERTEX); // Vertex are binded
        GL.vertexAttribPointer(SHADERS._position, 3, GL.FLOAT, false, 4 * (3 + 3 + 2), 0); // Vertex pointer
        GL.vertexAttribPointer(SHADERS._normal, 3, GL.FLOAT, false, 4 * (3 + 3 + 2), 3 * 4); // Normals pointer
        GL.vertexAttribPointer(SHADERS._uv, 2, GL.FLOAT, false, 4 * (3 + 3 + 2), (3 + 3) * 4); // Texture coordinates (u,v) pointer

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.FACES); // Faces are binded
        GL.drawElements(wireframe, this.faces.length, GL.UNSIGNED_SHORT, 0); // 6 faces * 2 triangles/face * 3 points/triangle
    };
};