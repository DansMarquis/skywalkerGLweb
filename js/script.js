/*
    Authors:
    - Daniel Marques 85070
    - Tomás Freitas  84957
*/
// Context
var gl = null;
var CANVAS = null;
// Matrices
var PROJMATRIX = null;
var MOVEMATRIX = null;
var VIEWMATRIX = null;
// Transformations
var zoom = null;
var moveX = null;
var moveY = null;
var orbitX = null;
var orbitY = null;
var drawDist = null;
// Controls
var pause = false;
var follow = false;
var perspective3D = true;
var wireframe = null;
var subDivisions = null;
// JSON PArsed
var bodies = null;
// Planet selection list
var planetsForm = null;
// Lists
var bodyModels = [];
var bodyObjects = [];
var bodyNames = [];
var bodyInfo = [];
// Last index
var lastIndex = null;
// Light Source RGB
var redL = null;
var greenL = null;
var blueL = null;
var xxL = null;
var yyL = null;
var zzL = null;
// Count FPS (Frames Per Second)
var elapsedTime = 0;
var frameCount = 0;
var lastfpsTime = new Date().getTime();

/*========================= COUNT FRAMES ========================= */
function countFrames() {

    var now = new Date().getTime();
    frameCount++;
    elapsedTime += (now - lastfpsTime);
    lastfpsTime = now;

    if (elapsedTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        elapsedTime -= 1000;
        document.getElementById('fps').innerHTML = 'FPS: ' + fps;
    }
}

/*========================= INIT PLANETS AND STARS ========================= */
function initPlanets(body, index) {

    var object = new Body(body.distance, body.translation, body.rotation, body.radius, true); // Creates Body
    bodyObjects.push(object); // Body Objet added to Objects list
    object.model(GL, body.radius / 2, body.texture);
    bodyModels.push(object); // Body Model added to Models list
    var option = document.createElement("option"); // Creates a body option in selection list
    bodyNames.push(body.name); // Body name added to Names list
    option.text = body.name;
    option.value = index;
    planetsForm.add(option);
    lastIndex = index;
}

/*========================= INIT MOONS ========================= */
function initMoons(body) {

    var object = new Body(body.distance, body.translation, body.rotation, body.radius, true); // Creates Body
    bodyObjects.push(object);
    object.model(GL, body.radius / 2, body.texture);
    bodyModels[body.planetID].addSatelite(object); // Add Body as Satellite of another Body
}

/*========================= INIT BODIES ========================= */
function initBodies() {

    planetsForm = document.getElementById("bodies"); // Selection list init

    bodies = JSON.parse(data); // Parse JSON
    bodies[0].forEach(initPlanets); // Planets and Stars
    bodies[1].forEach(initMoons); // Moons
}

/*========================= TRANSFORMATIONS ========================= */
function drawTransformations() {

    PROJMATRIX = MATHS.getProjection(45, CANVAS.width / CANVAS.height, 1, drawDist); // Projection matrix (distance)
    MOVEMATRIX = MATHS.getI4(); // Motion matrix
    VIEWMATRIX = MATHS.getI4(); // View matrix

    // Transform View
    MATHS.translateZ(VIEWMATRIX, zoom); // Zoom In/Out
    MATHS.translateX(VIEWMATRIX, moveX); // Move on X axis
    MATHS.translateY(VIEWMATRIX, moveY); // Move on Y axis
    MATHS.rotateX(VIEWMATRIX, orbitX); // Orbit Up/Down
    MATHS.rotateY(VIEWMATRIX, orbitY); // Orbit Right/Left

    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearColor(0.0, 0.0, 0.0, 0.0); // Background color transparent
    GL.clearDepth(1.0);
}

/*========================= SCENE ========================= */
function drawScene() {

    MATHS.setI4(MOVEMATRIX); // Identity matrix as motion matrix
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT); // Clear
    GL.uniformMatrix4fv(SHADERS._Mmatrix, false, MOVEMATRIX); // Model Matrix
    GL.uniformMatrix4fv(SHADERS._Pmatrix, false, PROJMATRIX); // Projection Matrix
    GL.uniformMatrix4fv(SHADERS._Vmatrix, false, VIEWMATRIX); // View Matrix

    bodyModels.forEach(drawModels); // Draw models

    function drawModels(body) {
        body.draw(GL, new Stack());
    }
    countFrames();
}

/*========================= ANIMATION ========================= */
var lastTime = 0;
var lastSelected = null;

function animate() {

    var timeNow = new Date().getTime();
    var id = parseInt(document.getElementById('bodies').value);
    document.getElementById('planetName').innerHTML = '' + bodyNames[id];
    if (bodies[0][id] != null) {
        document.getElementById('tspeed').innerHTML = '' + bodies[0][id].info.translation;
        document.getElementById('rspeed').innerHTML = '' + bodies[0][id].info.rotation;
        document.getElementById('odistance').innerHTML = '' + bodies[0][id].info.distance;
        document.getElementById('rradius').innerHTML = '' + bodies[0][id].info.diameter;
        document.getElementById('mass').innerHTML = '' + bodies[0][id].info.mass;
        document.getElementById("planetImg").src = "img/planets/" + bodies[0][id].info.name + ".png";
    } else {
        document.getElementById('tspeed').innerHTML = '0.0';
        document.getElementById('rspeed').innerHTML = '0.0';
        document.getElementById('odistance').innerHTML = '0.0';
        document.getElementById('rradius').innerHTML = '0.0';
        document.getElementById('mass').innerHTML = '0.0';
        document.getElementById("planetImg").src = "img/planets/unknown.png";
    }

    //console.log(bodyObjects[id]);
    if (lastTime != 0) {
        document.getElementById("follow").onclick = function() {
            follow = !follow;
            if (follow) { // If FOLLOW is activated
                document.getElementById("spanFollow").innerHTML = "Unfollow";
                var element = document.getElementById('follow');
                element.classList.remove("btn-success");
                element.classList.add("btn-danger");
                lastSelected = null;
            } else { // If UNFOLLOW is activated
                document.getElementById("spanFollow").innerHTML = "Follow";
                var element = document.getElementById('follow');
                element.classList.remove("btn-danger");
                element.classList.add("btn-success");
                if (perspective3D) { // If 3D is activated
                    zoom = -100;
                    orbitX = 0.2;
                    orbitY = 0.5;
                } else { // If 2D is activated
                    zoom = -100;
                    orbitX = 1.5;
                    orbitY = 0;
                }
            }
        }

        // Follow Body
        if (follow && !pause) {
            if (lastSelected != id) {
                lastSelected = id
                orbitX = 0.0;
                moveX = 0;
                moveY = 0;
                orbitY = -bodyModels[id].rotTranslation; // Init at center of planet translation
            }
            orbitX = 0.0;
            moveX = 0;
            moveY = 0;
            zoom = -bodyModels[id].distance - bodyModels[id].radius - (bodyModels[id].radius); // Zoom planet
            orbitY -= bodyModels[id].translation; // Anulation of translation velocity
        }
    }
    lastTime = timeNow;
}

/*========================= TIMER ========================= */
function tick() {

    requestAnimFrame(tick);
    drawTransformations();
    drawScene();
    animate();
}

/*========================= INIT WEBGL ========================= */
function initWebGL(CANVAS) {

    try {
        GL = CANVAS.getContext("experimental-webgl", { antialias: true });
    } catch (e) {
        alert("You browser does not support WebGL!");
        return false;
    }

}

/*========================= RUN WEBGL ========================= */
function runWebGL() {

    CANVAS = document.getElementById("space");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    initWebGL(CANVAS);

    GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height); // Sets the drawing area

    // Init Variables
    zoom = -100;
    orbitX = 0.2;
    orbitY = 0.5;
    drawDist = 400;
    redL = 0.8;
    greenL = 0.8;
    blueL = 0.8;
    xxL = 0;
    yyL = 0;
    zzL = 1.5;
    subDivisions = 32;

    SHADERS.initialize(GL);

    wireframe = GL.TRIANGLES;

    initBodies();
    setEventListeners();
    tick();

}