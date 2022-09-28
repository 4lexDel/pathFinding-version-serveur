class TileMap {
    static CLOSE_LIST = -4;
    static OPEN_LIST = -3;
    static PATH_LIST = -2;
    static OBSTACLE = -1;
    static ROAD = 0;
    static GRASS = 1;
    static WATER = 2;
    static SLUDGE = 3;
    static START = 10;
    static FINISH = 20;
    static VOID = 100;

    constructor(nbSquareX, canvasWidth, canvasHeight, defaultFill = 1) {
        this.nbSquareX = parseInt(nbSquareX);

        this.defaultFill = defaultFill;

        this.canvasWidth;
        this.canvasHeight;

        this.resize(canvasWidth, canvasHeight);
    }

    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.dx = canvasWidth / this.nbSquareX;
        this.dy = this.dx;

        this.nbSquareY = parseInt(canvasHeight / this.dx);
        // console.log("nbSquareY : ", this.nbSquareY);

        this.grid = new Array(this.nbSquareX);
        for (var x = 0; x < this.grid.length; x++) {
            this.grid[x] = new Array(this.nbSquareY);
        }
        this.resetGrid();
        //console.log(this.grid[0].length);
    }

    display(ctx) {
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                switch (this.grid[x][y]) {
                    case TileMap.GRASS:
                        ctx.fillStyle = "white"; //"#68B052";
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.ROAD:
                        ctx.fillStyle = "rgb(100, 100, 100)";
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.WATER:
                        ctx.fillStyle = "cyan";
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.SLUDGE:
                        ctx.fillStyle = "brown";
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.PATH_LIST:
                        ctx.fillStyle = "orange"; //PATH
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        // ctx.beginPath();
                        // ctx.ellipse(this.dx * (x + 0.5), this.dy * (y + 0.5), this.dx / 3, this.dy / 3, 0, 0, 2 * Math.PI);
                        // ctx.fill();
                        break;

                    case TileMap.OPEN_LIST:
                        ctx.fillStyle = "green"; //OpenList
                        ctx.globalAlpha = 0.5;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.CLOSE_LIST:
                        ctx.fillStyle = "red"; //closeList
                        ctx.globalAlpha = 0.5;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.START:
                        ctx.fillStyle = "blue";
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.FINISH:
                        ctx.fillStyle = "red";
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;

                    case TileMap.OBSTACLE:
                        ctx.fillStyle = "black";
                        ctx.globalAlpha = 1;
                        ctx.fillRect(x * this.dx, y * this.dy, this.dx, this.dy);
                        break;
                }

                ctx.strokeStyle = "rgb(200,200,200)";
                ctx.lineWidth = 0.1;
                ctx.strokeRect(x * this.dx, y * this.dy, this.dx, this.dy);
            }
        }
    }

    writelist(list, val) {
        this.resetGridById(val);
        list.forEach(node => {
            //console.log("X : " + node.x + " | Y : " + node.y);
            if (this.grid[node.x][node.y] != TileMap.START && this.grid[node.x][node.y] != TileMap.FINISH)
                this.grid[node.x][node.y] = val;
        });
        //console.log(this.grid);
    }

    writeSpecialPoint(x, y, id) {
        this.resetGridById(id);
        //this.resetGridById(TileMap.PATH_LIST);

        this.grid[x][y] = id;
    }

    resetGridById(id) {
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                if (this.grid[x][y] == id) this.grid[x][y] = this.defaultFill;
            }
        }
    }

    resetGrid() {
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                this.grid[x][y] = this.defaultFill;
            }
        }
    }

    updateGrid(coords, id) {
        this.resetGridById(-2);
        if (coords.x >= 0 && coords.y >= 0 && coords.x <= this.canvasWidth && coords.y <= this.canvasHeight) {
            let x = parseInt(coords.x / this.dx);
            let y = parseInt(coords.y / this.dy);

            this.grid[x][y] = id;
        }
    }

    getFinishCoordsWithoutObstacle() {
        for (let x = this.grid.length - 1; x >= 0; x--) {
            for (let y = this.grid[x].length - 1; y >= 0; y--) {
                if (this.grid[x][y] != TileMap.OBSTACLE) return { x: x, y: y };
            }
        }
    }

    getStartCoordsWithoutObstacle() {
        for (let x = 0; x < this.grid.length; x++) {
            for (let y = 0; y < this.grid[x].length; y++) {
                if (this.grid[x][y] != TileMap.OBSTACLE) return { x: x, y: y };
            }
        }
    }
}