/*
    Authors:
    - Daniel Marques 85070
    - Tomás Freitas  84957
*/
function setEventListeners() {
    document.getElementById("pause").onclick = function() {
        pause = !pause;
        pauseHandler();
    }


    // Zoom In/Out
    CANVAS.addEventListener("wheel", event => zoom -= (event.deltaY) / 30);

    // Delete Planet
    document.getElementById("delete").onclick = function() {

        var txt = planetsForm.options[planetsForm.selectedIndex].text;
        var id = bodyNames.indexOf(txt);
        if (id > -1) {
            bodyModels.splice(id, 1);
            bodyNames.splice(id, 1);
            bodyObjects.splice(id, 1);
        }
        console.log(bodyObjects);
        // Update last index
        lastIndex = lastIndex - 1;

        // Remove planet from list
        var x = document.getElementById("bodies");
        x.remove(x.selectedIndex);
    }

    // Add Planet
    document.getElementById("add").onclick = function() {

        resetCanvas();
        // Get values from inputs
        var name = document.getElementById("name").value;
        var distance = document.getElementById("distance").value;
        var translation = document.getElementById("translation").value;
        var rotation = document.getElementById("rotation").value;
        var radius = document.getElementById("radius").value;
        var texture = document.getElementById("texture").value;

        // Create Planet Object
        var newObj = new Body(parseFloat(distance), parseFloat(translation), parseFloat(rotation), parseFloat(radius), true);
        bodyObjects.push(newObj);
        newObj.model(GL, radius / 2, "img/textures/" + texture);
        bodyModels.push(newObj);
        var option = document.createElement("option");
        bodyNames.push(name);
        option.text = name;
        var id = lastIndex + 1;
        option.value = id;
        lastIndex = id;
        planetsForm.add(option);
    }

    document.body.onkeyup = function(e) {
        // Onclick ENTER Follow next planet
        if (e.keyCode == 13) {

            console.log("ENTER");
            var select = document.getElementById('bodies');
            if (!follow) {
                follow = true;
                document.getElementById("spanFollow").innerHTML = "Unfollow";
                var element = document.getElementById('follow');
                element.classList.remove("btn-success");
                element.classList.add("btn-danger");
                lastSelected = null;
            } else {
                if (select.selectedIndex == select.options.length - 1) {
                    select.selectedIndex = 0;
                } else {
                    select.selectedIndex++;
                }
            }
        }
        // Onclick CTRL Pause / Play
        if (e.keyCode == 17) {

            console.log("SPACE");
            pause = !pause;
            pauseHandler();
        }
    }

    // Rotations
    CANVAS.onmousedown = handleMouseDown;
    CANVAS.onmouseup = handleMouseUp;
    CANVAS.onmousemove = handleMouseMove;
};


// Handle Pause/Play
function pauseHandler() {
    if (!pause) {
        document.getElementById("pauseImg").src = "img/pause.png";
        document.getElementById("spanPause").innerHTML = "Pause";
        var element = document.getElementById('pause');
        element.classList.remove("btn-success");
        element.classList.add("btn-primary");
    } else {
        document.getElementById("pauseImg").src = "img/play.png";
        document.getElementById("spanPause").innerHTML = "Play"
        var element = document.getElementById('pause');
        element.classList.remove("btn-primary");
        element.classList.add("btn-success");
    }
}
// Follow Body Listener
function followBody(event) {
    event.preventDefault();
}
// Handling mouse events
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

function handleMouseDown(event) {

    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp() {

    mouseDown = false;
}

function handleMouseMove(event) {

    if (!mouseDown) {
        return;
    }

    // Pan and Orbit proportional to cursor displacement
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;

    // Pan
    if (event.shiftKey) {
        if (!follow) {
            moveX += radians(deltaX) * 7;
            moveY -= radians(deltaY) * 7;
        }
    }
    // Orbit
    else {
        if (!follow) {
            orbitY += radians(deltaX) / 2;
            orbitX += radians(deltaY) / 2;
        }

    }
    // Update cursor position
    lastMouseX = newX;
    lastMouseY = newY;
}

function radians(degrees) {
    return degrees * Math.PI / 180.0;
}

// Reset Canvas
function resetCanvas() {

    zoom = -100;
    orbitX = 0.2;
    orbitY = 0.5;
    bodyModels.forEach(drawModels);

    function drawModels(body, index) {
        body.rotRotation = 0;
        body.rotTranslation = 0;
    }
}

// 2D / 3D view switch
document.addEventListener('DOMContentLoaded', function() {
    var checkbox = document.getElementById("3d");

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            orbitX = 0.2;
            orbitY = 0.5;
            perspective3D = true;
        } else {
            orbitX = 1.5;
            orbitY = 0;
            perspective3D = false;
        }
    });
});
// LINE LOOP / TRIANGLES draw switch
document.addEventListener('DOMContentLoaded', function() {
    var checkbox = document.getElementById("wireframe");

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            wireframe = GL.TRIANGLES;
        } else {
            wireframe = GL.LINE_LOOP;
        }
    });
});