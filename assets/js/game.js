/**-------------------------------INIT GLOBAL VAR----------------------------------------------------------- */

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext("2d");

var MOUSE_X = 0;
var MOUSE_Y = 0;

var WIDTH;
var HEIGHT;


var DEFAULT_SIZE = 32;

var DEBUG = 0;
var RELEASE = 1;

var MODE = DEBUG;

resizeCanvas();

/**----------------------------------MAP INIT--------------------------------------------------------- */

function generateMaps(size) {
    var editMap = new TileMap(size, WIDTH, HEIGHT);
    var decorationMap = new TileMap(size, WIDTH, HEIGHT, TileMap.VOID);

    return {
        editMap: editMap,
        decorationMap: decorationMap
    }
}

/**--------------------------------------------------------------------------------------------------- */

let allMap = generateMaps(DEFAULT_SIZE); //C'est le bazar !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

var map = allMap.editMap;
var decorationMap = allMap.decorationMap;

var start = map.getStartCoordsWithoutObstacle();
var finish = map.getFinishCoordsWithoutObstacle();


var brush = TileMap.OBSTACLE; //Pinceau
var showAllList = true; //Detail du chemin
var solvingMethod = true;


test();
//draw();

function draw() {
    ctx.clearRect(0, 0, ctx.width, ctx.height);

    if (map != undefined && decorationMap != undefined) {
        map.display(ctx);

        decorationMap.writeSpecialPoint(start.x, start.y, TileMap.START);
        decorationMap.writeSpecialPoint(finish.x, finish.y, TileMap.FINISH); ///WHUT

        decorationMap.display(ctx);
    }

    //window.requestAnimationFrame(draw);
}

function test() {
    console.log("--------------------------------------------------------");
    console.time("JPS");
    let pathfindingJPS = new PathFindingJPS(start, finish, map.grid);
    let resultJPS = pathfindingJPS.process();
    console.timeEnd("JPS");

    console.time("Astar");
    let pathfindingAstar = new PathFindingAstar(start, finish, map.grid);
    let resultAStar = pathfindingAstar.process();
    console.timeEnd("Astar");
    console.log("--------------------------------------------------------");

    let finalResult = null;

    if (solvingMethod) {
        finalResult = resultJPS;
    } else finalResult = resultAStar;

    decorationMap.resetGrid();

    if (finalResult != null) {
        finalResult.pathList.shift();
        //console.log(path);

        if (showAllList) {
            decorationMap.writelist(finalResult.closeList, TileMap.CLOSE_LIST);
            decorationMap.writelist(finalResult.openList, TileMap.OPEN_LIST);
        }
        decorationMap.writelist(finalResult.pathList, TileMap.PATH_LIST);

        decorationMap.writeSpecialPoint(start.x, start.y, TileMap.START);
        decorationMap.writeSpecialPoint(finish.x, finish.y, TileMap.FINISH);
    }
    draw();
}

/**-------------------------------POP UP----------------------------------------------------------- */


function generateNewMaps() {
    resizeCanvas();

    let size = document.getElementById("numberCell").value;
    //console.log(size);

    allMap = generateMaps(size);

    map = allMap.editMap;
    decorationMap = allMap.decorationMap;

    finish = map.getFinishCoordsWithoutObstacle();

    decorationMap.writeSpecialPoint(finish.x, finish.y, TileMap.FINISH);

    test();
}

function changeBrush() {
    let select = document.getElementById("typeBrush");
    let value = select.options[select.selectedIndex].value;
    console.log(value);

    switch (value) {
        case "obstacle":
            brush = TileMap.OBSTACLE;
            break;

        case "ground":
            brush = TileMap.GRASS;
            break;

        case "road":
            brush = TileMap.ROAD;
            break;

        case "water":
            brush = TileMap.WATER;
            break;

        case "sludge":
            brush = TileMap.SLUDGE;
            break;

        case "start":
            brush = TileMap.START;
            break;

        case "finish":
            brush = TileMap.FINISH;
            break;
    }
}

function generateMaze() {
    if (map != undefined) {
        //console.log("Génération du labyrinthe");
        var maze = new MazeFusion(map.nbSquareX, map.nbSquareY); //!!!!!
        maze.generate();

        map.grid = maze.getGrid();
        start = start = map.getStartCoordsWithoutObstacle();
        finish = map.getFinishCoordsWithoutObstacle();

        test();
    }
}

function settingsUpdate() {
    showAllList = document.getElementById("showListInput").checked;

    let select = document.getElementById("solveMethod");
    let value = select.options[select.selectedIndex].value;

    if (value == "aStar") solvingMethod = false;
    else solvingMethod = true;

    test();
}


document.getElementById("generateMap").addEventListener("click", generateNewMaps);
document.getElementById("resetMap").addEventListener("click", function() {
    map.resetGrid();
    decorationMap.resetGrid();
    test();
});

document.getElementById("getBrush").addEventListener("click", changeBrush);

document.getElementById("validSettings").addEventListener("click", settingsUpdate);

document.getElementById("generateMaze").addEventListener("click", generateMaze);


/**------------------------------------------------------------------- */

// canvas.onclick = (e) => { //MOUSE CLICK
//     var mouse = getMousePos(canvas, e);

//     let val = -1;
//     if (!brushId) val = 1;

//     if (e.which == 1) map.updateGrid(mouse, val);
//     else map.updateGrid(mouse, 0);
//     test();
// }

canvas.addEventListener("mousemove", (e) => { //UPDATE GLOBAL MOUSE VARIABLE
    let topPosY = canvas.offsetTop;
    let leftPosX = canvas.offsetLeft;

    var mouse = {
            x: e.clientX - leftPosX,
            y: e.clientY - topPosY
        }
        //console.log("x : " + mouse.x + " y : " + mouse.y);

    MOUSE_X = mouse.x;
    MOUSE_Y = mouse.y;
})


var startDrag = false;

function mouseInteraction(e) {
    var mouse = getMousePos(canvas, e);

    if (e.which == 1) {
        if (brush == TileMap.START || brush == TileMap.FINISH) {
            if (brush == TileMap.START) {
                start = {
                    x: parseInt(mouse.x / decorationMap.dx),
                    y: parseInt(mouse.y / decorationMap.dy)
                }
            } else {
                finish = {
                    x: parseInt(mouse.x / decorationMap.dx),
                    y: parseInt(mouse.y / decorationMap.dy)
                }
            }
        } else map.updateGrid(mouse, brush);
    } else map.updateGrid(mouse, TileMap.GRASS);
    test();
}

function touchInteraction(e) {
    var touch = getTouchPos(canvas, e);
    console.log(touch);

    if (brush == TileMap.START || brush == TileMap.FINISH) {
        if (brush == TileMap.START) {
            start = {
                x: parseInt(touch.x / decorationMap.dx),
                y: parseInt(touch.y / decorationMap.dy)
            }
        } else {
            finish = {
                x: parseInt(touch.x / decorationMap.dx),
                y: parseInt(touch.y / decorationMap.dy)
            }
        }
    } else map.updateGrid(touch, brush);

    test();
}

/*-------------------------------------------------*/

canvas.onmousedown = (e) => {
    startDrag = true;

    mouseInteraction(e);
}

canvas.onmousemove = (e) => {
    if (startDrag) {

        mouseInteraction(e);
    }
}

canvas.onmouseup = (e) => {
    if (startDrag) {
        startDrag = false;

        mouseInteraction(e);
    }
}

/*-------------------------------------------------*/


canvas.addEventListener('touchstart', function(e) {
    startDrag = true;

    touchInteraction(e);
}, false);

canvas.addEventListener('touchmove', function(e) {
    if (startDrag) {
        touchInteraction(e);
    }

}, false);

canvas.addEventListener('touchend', function(e) {
    startDrag = false;

    touchInteraction(e);
}, false);



/*-------------------------------------------------*/


document.addEventListener("keyup", function(e) { //KEYBOARD EVENT
    // console.log(e.key);

    switch (e.key) {
        case "Enter":
            test();
            break;

        case "r":
            map.resetGrid();
            decorationMap.resetGrid();
            test();
            break;

        case "a":
            let xa = parseInt(MOUSE_X / map.dx);
            let ya = parseInt(MOUSE_Y / map.dy);

            decorationMap.writeSpecialPoint(xa, ya, TileMap.START);

            start = {
                x: xa,
                y: ya
            }

            test();

            break;

        case "b":
            let xb = parseInt(MOUSE_X / map.dx);
            let yb = parseInt(MOUSE_Y / map.dy);

            decorationMap.writeSpecialPoint(xb, yb, TileMap.FINISH);

            finish = {
                x: xb,
                y: yb
            }

            test();

            break;

        case "m":
            console.log(map.grid);

            break;
    }

    //map.
})

document.addEventListener("keydown", function(e) { //KEYBOARD EVENT
    // console.log(e.key);
})

window.onresize = (e) => {
    resizeCanvas();
};

function resizeCanvas() {
    console.log("RESIZE !!");
    WIDTH = 10 * getWidth() / 10;
    HEIGHT = 10 * getHeight() / 10;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    console.log("WIDTH : " + canvas.clientWidth + " - HEIGHT : " + canvas.clientHeight);
    console.log("WIDTH : " + canvas.width + " - HEIGHT : " + canvas.height);
    console.log("WIDTH : " + WIDTH + " - HEIGHT : " + HEIGHT);


    if (map != undefined && decorationMap != undefined) {
        map.resize(WIDTH, HEIGHT);
        decorationMap.resize(WIDTH, HEIGHT);

        start = map.getStartCoordsWithoutObstacle();
        finish = map.getFinishCoordsWithoutObstacle();


        test();
    }


    //draw();
}