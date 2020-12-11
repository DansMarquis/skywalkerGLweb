/*
    Authors:
    - Daniel Marques 85070
    - Tomás Freitas  84957
*/
var SPHERE = {
    getSphereVertex: function(radius, res) { // The vertex, normals and texture coordinates are obtained
        var vertexData = [],
            alpha, beta, x, y, z, u, v;
        for (var i = 0; i <= res; i++) { // Latitudes are covered
            alpha = i * Math.PI / res; // Latitude angle
            for (var j = 0; j <= res; j++) { // Longitudes are covered
                beta = j * 2 * Math.PI / res; // Longitude angle
                // x, y and z calculation for vertex and normals
                x = Math.cos(beta) * Math.sin(alpha);
                y = Math.cos(alpha);
                z = Math.sin(beta) * Math.sin(alpha);
                // u and v calculation for texture coordinates
                u = 1 - (j / res);
                v = 1 - (i / res);
                // Vertex
                vertexData.push(radius * x);
                vertexData.push(radius * y);
                vertexData.push(radius * z);
                // Normals
                vertexData.push(x);
                vertexData.push(y);
                vertexData.push(z);
                // Texture coordinates
                vertexData.push(u);
                vertexData.push(v);
            }
        }
        return vertexData;
    },

    getShereFaces: function(res) { // Indexes are obtained to create the faces
        var indexData = [],
            first, second;
        for (var i = 0; i < res; i++) { // Latitudes are covered
            for (var j = 0; j < res; j++) { // Longitudes are covered
                // Calculation of the upper and lower left corners
                first = (i * (res + 1)) + j;
                second = first + res + 1;
                // Even Face
                indexData.push(first); // Upper left corner
                indexData.push(second); // Lower left corner
                indexData.push(first + 1); // Upper right corner
                // Odd Face
                indexData.push(second); // Lower left corner
                indexData.push(second + 1); // Lower right corner
                indexData.push(first + 1); // Upper right corner
            }
        }
        return indexData;
    }
};