/*
    Authors:
    - Daniel Marques 85070
    - Tomás Freitas  84957

Here we use Column-Major Notation:
        |    0        4        8        12   |
        |                                    |
        |    1        5        9        13   |
        |                                    |
        |    2        6        10       14   |
        |                                    |
        |    3        7        11       15   |
*/

var MATHS = {

    // Degrees to Radians function
    degToRad: function(degrees) {
        return (degrees * Math.PI / 180);
    },

    // Get projection matrix
    getProjection: function(degrees, a, zMin, zMax) {
        var tan = Math.tan(MATHS.degToRad(0.5 * degrees)),
            A = -(zMax + zMin) / (zMax - zMin),
            B = (-2 * zMax * zMin) / (zMax - zMin);

        return [
            0.5 / tan, 0, 0, 0,
            0, 0.5 * a / tan, 0, 0,
            0, 0, A, -1,
            0, 0, B, 0
        ];
    },

    // Get Identity Matrix
    getI4: function() {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    },

    // Set Identity Matrix
    /*      1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
    */
    setI4: function(m) {
        m[0] = 1; // m[0][0]
        m[1] = 0; // m[1][0]
        m[2] = 0; // m[2][0]
        m[3] = 0; // m[3][0]
        m[4] = 0; // m[0][1]
        m[5] = 1; // m[1][1]
        m[6] = 0; // m[2][1]
        m[7] = 0; // m[3][1]
        m[8] = 0; // m[0][2]
        m[9] = 0; // m[1][2]
        m[10] = 1; // m[2][2]
        m[11] = 0; // m[3][2]
        m[12] = 0; // m[0][3]
        m[13] = 0; // m[1][3]
        m[14] = 0; // m[2][3]
        m[15] = 1; // m[3][3]
    },

    // Rotate X 
    rotateX: function(m, degrees) {
        var c = Math.cos(degrees),
            s = Math.sin(degrees),
            mv1 = m[1], // m[1][0]
            mv5 = m[5], // m[1][1]
            mv9 = m[9]; // m[1][2]
        // m[1][x]
        m[1] = m[1] * c - m[2] * s; // m[1][0]
        m[5] = m[5] * c - m[6] * s; // m[1][1]
        m[9] = m[9] * c - m[10] * s; // m[1][2]
        // m[2][x]
        m[2] = m[2] * c + mv1 * s; // m[2][0]
        m[6] = m[6] * c + mv5 * s; // m[2][1]
        m[10] = m[10] * c + mv9 * s; // m[2][2]
    },

    // Rotate Y
    rotateY: function(m, degrees) {
        var c = Math.cos(degrees),
            s = Math.sin(degrees),
            mv0 = m[0], // m[0][0]
            mv4 = m[4], // m[0][1]
            mv8 = m[8]; // m[0][2]
        // m[0][x]
        m[0] = c * m[0] + s * m[2]; // m[0][0]
        m[4] = c * m[4] + s * m[6]; // m[0][1]
        m[8] = c * m[8] + s * m[10]; // m[0][2]
        // m[2][x]
        m[2] = c * m[2] - s * mv0; // m[2][0]
        m[6] = c * m[6] - s * mv4; // m[2][1]
        m[10] = c * m[10] - s * mv8; // m[2][2]
    },

    // Rotate Z
    rotateZ: function(m, degrees) {
        var c = Math.cos(degrees),
            s = Math.sin(degrees),
            mv0 = m[0], // m[0][0]
            mv4 = m[4], // m[0][1]
            mv8 = m[8]; // m[0][2]
        // m[0][x]
        m[0] = c * m[0] - s * m[1]; // m[0][0]
        m[4] = c * m[4] - s * m[5]; // m[0][1]
        m[8] = c * m[8] - s * m[9]; // m[0][2]
        // m[1][x]
        m[1] = c * m[1] + s * mv0; // m[1][0]
        m[5] = c * m[5] + s * mv4; // m[1][1]
        m[9] = c * m[9] + s * mv8; // m[1][2]
    },

    // Translate X 
    translateX: function(m, t) {
        m[12] += t; // m[0][3]
    },

    // Translate Y
    translateY: function(m, t) {
        m[13] += t; // m[1][3]
    },

    // Translate Z
    translateZ: function(m, t) {
        m[14] += t; // m[2][3]
    },

    mul: function(a, b) {
        return [
            a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
            a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
            a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
            a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
            a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
            a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
            a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
            a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
            a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
            a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
            a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
            a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],
            a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
            a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
            a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
            a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
        ];
    }
};