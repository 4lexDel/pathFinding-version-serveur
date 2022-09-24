class MazeDFS { //Based on "Depth First Search Algorithm" (DFS)
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
        for (var x = 0; x < this.nodes.length; x++) {
            for (var y = 0; y < this.nodes[x].length; y++) {
                this.nodes[x][y] = new NodeMazeDFS(x, y, null, MazeDFS.OBSTACLE); //-1 = obstacle
            }
        }
    }

    generate() {
        var i = 0;
        var startNode = this.nodes[0][0];
        startNode.id = MazeDFS.PASSABLE;

        var currentNode = startNode;

        var newSegment = this.generateSegment(currentNode.x, currentNode.y, currentNode);

        //currentNode = newSegment.currentNode;

        do {
            while (newSegment != false) {
                currentNode = newSegment.currentNode;
                var x = newSegment.x;
                var y = newSegment.y;

                newSegment = this.generateSegment(x, y, currentNode);
            }

            //console.log("X : " + currentNode.x + " | Y : " + currentNode.y);

            currentNode = currentNode.parentNode;
            newSegment = this.generateSegment(currentNode.x, currentNode.y, currentNode);

        } while (!currentNode.isEqual(startNode) /*&& false*/ );
    }

    generateSegment(x, y, currentNode) { //return grid a la fin !!
        var directions = [];
        /**
         * x+2 : 1
         * x-2 : 2
         * y+2 : 3
         * y-2 : 4
         */

        if (x + 2 < this.sizeX && this.nodes[x + 2][y].id == MazeDFS.OBSTACLE) {
            directions.push(1)
        }
        if (x - 2 >= 0 && this.nodes[x - 2][y].id == MazeDFS.OBSTACLE) {
            directions.push(2) //Ajout des directions possible
        }
        if (y + 2 < this.sizeY && this.nodes[x][y + 2].id == MazeDFS.OBSTACLE) {
            directions.push(3)
        }
        if (y - 2 >= 0 && this.nodes[x][y - 2].id == MazeDFS.OBSTACLE) {
            directions.push(4)
        }

        if (directions.length > 0) {
            let directionChoose = directions[Math.floor(Math.random() * directions.length)]; //On choisit parmis les directions disponible

            switch (directionChoose) {
                case 1:
                    return this.createSegment(x, y, 1, 0, currentNode);

                case 2:
                    return this.createSegment(x, y, -1, 0, currentNode);

                case 3:
                    return this.createSegment(x, y, 0, 1, currentNode);

                case 4:
                    return this.createSegment(x, y, 0, -1, currentNode);
            }
        }

        return false; //Impossible de générer (pas la place)
    }

    createSegment(x, y, dx, dy, currentNode) {
        this.nodes[x + dx][y + dy].id = MazeDFS.PASSABLE;
        this.nodes[x + 2 * dx][y + 2 * dy].id = MazeDFS.PASSABLE;

        this.nodes[x + 2 * dx][y + 2 * dy].parentNode = currentNode;

        return {
            currentNode: this.nodes[x + 2 * dx][y + 2 * dy],
            x: x + 2 * dx,
            y: y + 2 * dy
        };
    }

    getGrid() {
        let grid = new Array(this.nodes.length);

        for (var x = 0; x < grid.length; x++) {
            grid[x] = new Array(this.nodes[x].length); //Init array
        }

        for (var x = 0; x < grid.length; x++) {
            for (var y = 0; y < grid[0].length; y++) { //Create grid
                grid[x][y] = this.nodes[x][y].id;
            }
        }

        return grid;
    }
}