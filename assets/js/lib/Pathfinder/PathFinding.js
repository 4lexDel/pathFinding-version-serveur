class PathFinding {
    constructor(startCoords, finishCoords, grid) {
        this.i = 1;
        ///////////////////////
        this.startNode = new NodePathfinder(0, startCoords.x, startCoords.y);
        this.finishNode = new NodePathfinder(0, finishCoords.x, finishCoords.y);

        this.grid = grid;

        this.openList = [];
        this.closeList = [];
        this.pathList = [];

        this.currentNode = null;

        this.nodes = new Array(this.grid.length);

        for (var x = 0; x < this.grid.length; x++) {
            this.nodes[x] = new Array(this.grid[0].length); //Init array
        }

        for (var x = 0; x < this.nodes.length; x++) {
            for (var y = 0; y < this.nodes[0].length; y++) { //Create nodes instances
                this.nodes[x][y] = new NodePathfinder(grid[x][y], x, y);
            }
        }

        this.startNode.refreshCost(null, this.finishNode); //Calcul des couts du start
        this.openList.push(this.startNode); //On l'ajoute dans l'openlist
    }

    process() {
        //console.log("Solving...");

        let result = 0;

        while (result == 0) {
            result = this.findPath();
        }

        //console.log("FIN : ");
        if (result == 1) {
            // let newPath = this.pathList.map((node) => {
            //     return {
            //         x: node.x,
            //         y: node.y
            //     }
            // });

            return {
                pathList: this.pathList,
                openList: this.openList,
                closeList: this.closeList
            }

        } else return null;
    }

    findPath() {
        //console.log("----------------------------Itération n°" + this.i + "----------------------------");
        this.i++;
        var currentNode = this.changeCurrentNode(); //Le noeud avec le plus petit cout F passe noeud actuel !
        //console.log("currentNode : ");
        //console.log(currentNode);

        if (currentNode == null) {
            //console.log("Pas de solution !");
            return -1;
        }

        ////console.log("Taille openList : " + this.openList.length);
        ////console.log("Taille closeList : " + this.closeList.length);

        //On le retire de l'openlist
        this.openList = this.openList.filter((node) => {
            return !node.isEqual(currentNode);
        });

        this.closeList.push(currentNode); //On l'ajoute dans la closelist

        if (currentNode.isEqual(this.finishNode)) { //Est ce que on est arrivé ?
            //console.log("Path found !");
            let currentPath = currentNode;

            while (currentPath.parentNode != null) {
                this.pathList.push(currentPath);

                currentPath = currentPath.parentNode; //On remonte le chemin avec les liens de parenté
            }

            //displayPath();                      //Histoire d'y voir plus clair
            return 1; //Path found !!
        }

        let neighbours = this.getNeighbours(currentNode); //On récupère les voisins du noeud actuel////////////////////////

        ////console.log("nb voisins : " + neighbours.length);

        neighbours = neighbours.map((node) => { //RETURN UTILE ??????????????
            node.refreshCost(currentNode, this.finishNode); //On calcul leurs coûts (les couts restent inchangés si ils sont plus important)           
            if (!this.findNodeInList(this.openList, node)) this.openList.push(node); //On ajoute les voisins dans l'openList si ils y sont pas déja !

            return node;
        })


        return 0; //Si on est la c'est qu'on a pas encore trouvé la sortie
    }

    changeCurrentNode() {
        if (this.openList.length <= 0) return null; //pas de solution !!

        let openListSorted = this.openList.sort((a, b) => { //H COST !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            return (a.fCost - b.fCost || (a.fCost == b.fCost && a.hCost - b.hCost));
        });

        //this.openListSorted.map((node) => { //console.log(node.fCost) });

        return openListSorted[0];
    }

    getNeighbours(node) {
        let neighbours = [];

        let x = node.x;
        let y = node.y;

        let rightNode = this.getNode(x, y, 1, 0);
        let leftNode = this.getNode(x, y, -1, 0);
        let bottomNode = this.getNode(x, y, 0, 1);
        let topNode = this.getNode(x, y, 0, -1);

        neighbours.push(rightNode);
        neighbours.push(leftNode);
        neighbours.push(bottomNode);
        neighbours.push(topNode);

        //console.log(rightNode);

        if (rightNode != null && bottomNode != null) //Prevent corner
            neighbours.push(this.getNode(x, y, 1, 1));

        if (rightNode != null && topNode != null)
            neighbours.push(this.getNode(x, y, 1, -1));

        if (leftNode != null && bottomNode != null)
            neighbours.push(this.getNode(x, y, -1, 1));

        if (leftNode != null && topNode != null)
            neighbours.push(this.getNode(x, y, -1, -1));

        //console.log("VOISINS : ");

        neighbours = neighbours.filter((node) => { return node != null });
        //console.log(neighbours);

        return neighbours;
    }

    getNode(x, y, dx, dy) {
        if (x + dx >= 0 && x + dx < this.nodes.length && y + dy >= 0 && y + dy < this.nodes[0].length &&
            this.nodes[x + dx][y + dy].id != -1 &&
            !this.findNodeInList(this.closeList, this.nodes[x + dx][y + dy])) return this.nodes[x + dx][y + dy];

        return null;
    }

    findNodeInList(list, targetNode) {
        let listFound = list.find((node) => { return node.isEqual(targetNode) })

        return listFound != null;
    }
}