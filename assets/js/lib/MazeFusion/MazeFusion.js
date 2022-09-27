class MazeFusion { //https://www.youtube.com/watch?v=diXAllbirZg&ab_channel=Maths-Info
    static OBSTACLE = -1;
    static PASSABLE = 1;

    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;

        this.nodes = new Array(sizeX);


        for (var x = 0; x < this.nodes.length; x++) {
            this.nodes[x] = new Array(this.sizeY); //Init array
        }

        this.initNodes();
    }

    initNodes() {
        this.nbArea = 0;
        this.wallNodes = [];

        for (var x = 0; x < this.nodes.length; x++) {
            for (var y = 0; y < this.nodes[x].length; y++) {
                if (x % 2 == 0 || y % 2 == 0) this.nodes[x][y] = new NodeMazeFusion(x, y, MazeFusion.OBSTACLE, -1); //-1 = obstacle
                else {
                    this.nbArea++;
                    this.nodes[x][y] = new NodeMazeFusion(x, y, MazeFusion.PASSABLE, this.nbArea);
                }
                if ((x % 2 == 0 && y % 2 != 0) || (x % 2 != 0 && y % 2 == 0)) {
                    this.wallNodes.push(this.nodes[x][y]);
                }
            }
        }
    }

    generate() {
        do {
            this.fusionRandomArea();
        } while (this.nbArea > 1);
    }

    fusionRandomArea() {
        let wallNode = this.wallNodes[Math.floor(Math.random() * this.wallNodes.length)];

        let process = false;

        if (wallNode.x % 2 == 0) { //2 cas de figure 
            let rightNode = this.getNode(wallNode.x, wallNode.y, -1, 0);
            let leftNode = this.getNode(wallNode.x, wallNode.y, 1, 0);

            if (rightNode != null && leftNode != null) {
                if (rightNode.areaId != leftNode.areaId) { //Valeur de zone différentes ???
                    this.setAreaIdByAreaId(rightNode.areaId, leftNode.areaId);

                    wallNode.areaId = leftNode.areaId;

                    process = true;
                }
            }
        } else {
            let bottomNode = this.getNode(wallNode.x, wallNode.y, 0, 1);
            let topNode = this.getNode(wallNode.x, wallNode.y, 0, -1);

            if (bottomNode != null && topNode != null) {
                if (bottomNode.areaId != topNode.areaId) { //Valeur de zone différentes ???
                    this.setAreaIdByAreaId(bottomNode.areaId, topNode.areaId);

                    wallNode.areaId = topNode.areaId;

                    process = true;
                }
            }
        }

        if (process) {
            wallNode.id = MazeFusion.PASSABLE;
            this.nbArea--;

            this.wallNodes = this.wallNodes.filter((node) => { return !node.isEqual(wallNode) });
            // console.log("New length : " + this.wallNodes.length);
            // console.log("New nbArea : " + this.nbArea);
            return true;
        }
        return false;
    }

    setAreaIdByAreaId(oldAreaId, newAreaId) { //Optimisable
        for (var x = 0; x < this.nodes.length; x++) {
            for (var y = 0; y < this.nodes[x].length; y++) {
                if (this.nodes[x][y].areaId == oldAreaId) {
                    this.nodes[x][y].areaId = newAreaId;
                }
            }
        }
    }

    getNode(x, y, dx, dy) {
        if (x + dx >= 0 && x + dx < this.nodes.length && y + dy >= 0 && y + dy < this.nodes[0].length &&
            this.nodes[x + dx][y + dy].id != -1) return this.nodes[x + dx][y + dy];

        return null;
    }

    getGrid() {
        let grid = new Array(this.nodes.length); //MAPPER NODE !!!!!!!!!!!!!!!!!!!!!

        for (let x = 0; x < grid.length; x++) {
            grid[x] = new Array(this.nodes[x].length); //Init array
        }

        for (let x = 0; x < grid.length; x++) {
            for (var y = 0; y < grid[0].length; y++) { //Create grid
                grid[x][y] = this.nodes[x][y].id;
            }
        }

        return grid;
    }
}