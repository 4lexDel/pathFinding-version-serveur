class PathFindingJPS { //https://zerowidth.com/2013/a-visual-explanation-of-jump-point-search.html
    static TOP_LEFT = 0;
    static TOP = 1;
    static TOP_RIGHT = 2;
    static RIGHT = 3;
    static BOTTOM_RIGHT = 4;
    static BOTTOM = 5;
    static BOTTOM_LEFT = 6;
    static LEFT = 7;

    constructor(startCoords, finishCoords, grid) {
        this.i = 1;
        this.startNode = new NodeJPS(0, startCoords.x, startCoords.y);
        this.finishNode = new NodeJPS(0, finishCoords.x, finishCoords.y);

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
                this.nodes[x][y] = new NodeJPS(grid[x][y], x, y);
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

        if (result == 1) {
            return {
                pathList: this.pathList,
                openList: this.openList,
                closeList: this.closeList
            }

        } else return null;
    }

    findPath() {
        // console.log("----------------------------Itération n°" + this.i + "----------------------------");
        this.i++;
        var currentNode = this.changeCurrentNode(); //Le noeud avec le plus petit cout F passe noeud actuel !

        if (currentNode == null) {
            //     OPEN LIST VIDE !
            return -1;
        }

        //On le retire de l'openlist
        this.openList = this.openList.filter((node) => {
            return !node.isEqual(currentNode);
        });

        this.closeList.push(currentNode); //On l'ajoute dans la closelist

        if (currentNode.isEqual(this.finishNode)) { //Est ce que on est arrivé ?
            let currentPath = currentNode;

            while (currentPath.parentNode != null) {
                this.pathList.push(currentPath);

                currentPath = currentPath.parentNode; //On remonte le chemin avec les liens de parenté
            }
            // console.log("PATH : ");
            // console.log(this.pathList);
            return 1; //Path found !!
        }

        // console.log("Current node");
        // console.log(currentNode);
        let jumpPoints = this.getAllJumpPointFromNode(currentNode);
        // console.log("Points de sauts");
        // console.log(jumpPoints);

        jumpPoints = jumpPoints.map((node) => {
            node.refreshCost(currentNode, this.finishNode); //On calcul leurs coûts (les couts restent inchangés si ils sont plus important)           
            if (!this.findNodeInList(this.openList, node)) this.openList.push(node); //On ajoute les voisins dans l'openList si ils y sont pas déja !   //A VOIR

            return node;
        });

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

    getAllJumpPointFromNode(node) {
        var jumpPoints = [];

        if (node.dx == null && node.dy == null) { //Toutes les directions au debut
            jumpPoints = jumpPoints.concat(this.getJumpPointFromNodeInAllDirection(node));
        } else {
            jumpPoints.push(this.getJumpPoint(node, node.dx, node.dy)); //On prolonge l'ancien noeud !

            if (node.dx != 0 && node.dy != 0) { //diago
                jumpPoints.push(this.getJumpPoint(node, node.dx, 0)); //horizontal
                jumpPoints.push(this.getJumpPoint(node, 0, node.dy)); //vertical
            }

            jumpPoints = jumpPoints.concat(this.getForcedNeighbours(node, node.dx, node.dy)); //ON AJOUTE LES VOISINS FORCES !
        }

        jumpPoints = jumpPoints.filter((node) => { return node != null });

        return jumpPoints;
    }

    getJumpPointFromNodeInAllDirection(node) {
        let jumpPoints = [];

        jumpPoints.push(this.getJumpPoint(node, 1, 0)); //Droite
        jumpPoints.push(this.getJumpPoint(node, -1, 0)); //Gauche
        jumpPoints.push(this.getJumpPoint(node, 0, 1)); //Bas
        jumpPoints.push(this.getJumpPoint(node, 0, -1)); //Haut

        jumpPoints.push(this.getJumpPoint(node, 1, 1)); //Bas Droite
        jumpPoints.push(this.getJumpPoint(node, -1, 1)); //Bas Gauche
        jumpPoints.push(this.getJumpPoint(node, 1, -1)); //Haut droite
        jumpPoints.push(this.getJumpPoint(node, -1, -1)); //Haut gauche

        jumpPoints = jumpPoints.filter((node) => { return node != null });

        return jumpPoints;
    }

    getJumpPoint(currentNode, dx, dy) {
        if ((dx != 0 && dy == 0) || (dx == 0 && dy != 0)) {
            return this.checkJumpPointInLine(currentNode.x + dx, currentNode.y + dy, dx, dy); //decalage
        } else if (dx != 0 && dy != 0) {
            return this.checkJumpPointInDiagonal(currentNode.x + dx, currentNode.y + dy, dx, dy);
        }
    }

    checkJumpPointInDiagonal(ox, oy, dx, dy) { //UTILISE checkJumpPointInLine POUR TROUVER UN POINT "INTERESSANT" IN LINE ET RETOURNE LE NOEUD DIAGONAL RACINE
        if (dx != 0 && dy != 0) {
            let x = ox;
            let y = oy;

            while (true) {
                let node = this.getNode(x, y, 0, 0); //Noeud actuel dans la recursivité

                let firstSideNode = this.getNode(x - dx, y, 0, 0); //   Pour éviter de passer les corner !!!!!!
                let secondSideNode = this.getNode(x, y - dy, 0, 0);

                if ((node != null && node.id != -1) && (firstSideNode != null && secondSideNode != null && (firstSideNode.id != -1 || secondSideNode.id != -1))) {
                    let forcedNeighbours = this.getForcedNeighbours(node, dx, dy);
                    if (forcedNeighbours.length > 0) {
                        node.dx = dx;
                        node.dy = dy;
                        return node;
                    }

                    let firstLine = this.checkJumpPointInLine(x + dx, y, dx, 0); //Decalage pour eviter de detecter un faux positif !
                    let secondLine = this.checkJumpPointInLine(x, y + dy, 0, dy);

                    if (firstLine != null || secondLine != null) { //Est ce que une des 2 lignes à donné un résultat ?
                        node.dx = dx;
                        node.dy = dy; //direction
                        return node;
                    }
                } else return null;

                x += dx;
                y += dy;
            }
        }
        return null;
    }

    checkJumpPointInLine(ox, oy, dx, dy) { //TEST UN PATERN CARACTERISTIQUE D'UN POINT "INTERESSANT" ET LE RETOURNE SI IL EXISTE...
        // console.log("OX : " + ox + " | OY : " + oy + " | DX : " + dx + " | DY : " + dy);
        if (dx != 0 && dy == 0) { //Horizontal
            let x = ox;
            let y = oy;

            while (true) {
                // console.log("x : " + x + " | y : " + y);

                let node = this.getNode(x, y, 0, 0); //Noeud actuel dans la recursivité

                if (node != null && node.id != -1) {
                    if (node.isEqual(this.finishNode)) {
                        node.dx = dx;
                        node.dy = 0;
                        return node;
                    } //On est sur l'arrivée

                    let forcedNeighbours = this.getForcedNeighbours(node, dx, 0);
                    if (forcedNeighbours.length > 0) {
                        node.dx = dx;
                        node.dy = 0;
                        return node;
                    }
                } else return null;


                x += dx; //On avance (a la fin car on a besoin pour le cas diagonal de tester le paterne une premiere fois sur place)
            }
        } else if (dx == 0 && dy != 0) {
            let x = ox;
            let y = oy;

            while (true) {
                let node = this.getNode(x, y, 0, 0); //Noeud actuel dans la recursivité = RACINE LOCAL

                if (node != null && node.id != -1) {
                    if (node.isEqual(this.finishNode)) {
                        node.dx = dx;
                        node.dy = 0;
                        return node;
                    } //On est sur l'arrivée

                    let forcedNeighbours = this.getForcedNeighbours(node, 0, dy);
                    if (forcedNeighbours.length > 0) {
                        node.dx = 0;
                        node.dy = dy;
                        return node;
                    }
                } else return null;
                y += dy; //On avance (a la fin car on a besoin pour le cas diagonal de tester le paterne une premiere fois sur place)
            }
        }
        return null;
    }

    getForcedNeighbours(rootNode, dx, dy) {
        let forcedNeighbours = [];

        if (dx != null && dy != null) {

            if (rootNode != null && rootNode.id != -1) {
                let x = rootNode.x;
                let y = rootNode.y;

                if (dx != 0 && dy == 0) {
                    let nextNode = this.getNode(x, y, dx, 0); //Juste devant

                    if (nextNode != null && nextNode.id != -1) { //est ce que ya de la place devant nous ?
                        let topNode = this.getNode(x, y, 0, -1);
                        let nextTopNode = this.getNode(x, y, dx, -1);

                        let bottomNode = this.getNode(x, y, 0, 1);
                        let nextBottomNode = this.getNode(x, y, dx, 1);

                        if (topNode != null && nextTopNode != null && topNode.id == -1 && nextTopNode.id != -1) {
                            nextTopNode.dx = dx;
                            nextTopNode.dy = -1;
                            forcedNeighbours.push(nextTopNode);
                        }
                        if (bottomNode != null && nextBottomNode != null && bottomNode.id == -1 && nextBottomNode.id != -1) { //Obstacle en bas ou en haut et rien à coté !
                            nextBottomNode.dx = dx;
                            nextBottomNode.dy = 1;
                            forcedNeighbours.push(nextBottomNode);
                        }
                    }
                } else if (dx == 0 && dy != 0) {
                    let nextNode = this.getNode(x, y, 0, dy); //Juste devant

                    if (nextNode != null && nextNode.id != -1) { //est ce que ya de la place devant nous ?
                        let leftNode = this.getNode(x, y, -1, 0);
                        let nextLeftNode = this.getNode(x, y, -1, dy);

                        let rightNode = this.getNode(x, y, 1, 0);
                        let nextRightNode = this.getNode(x, y, 1, dy);

                        if (leftNode != null && nextLeftNode != null && leftNode.id == -1 && nextLeftNode.id != -1) { //Obstacle en bas ou en haut et rien à coté !
                            nextLeftNode.dx = -1;
                            nextLeftNode.dy = dy;
                            forcedNeighbours.push(nextLeftNode);
                        }

                        if (rightNode != null && nextRightNode != null && rightNode.id == -1 && nextRightNode.id != -1) {
                            nextRightNode.dx = 1;
                            nextRightNode.dy = dy;
                            forcedNeighbours.push(nextRightNode);
                        }
                    }
                } else if (dx != 0 && dy != 0) {
                    let nextFirst = this.getNode(x, y, 0, dy);

                    if (nextFirst != null && nextFirst.id != -1) {
                        let sideFirst = this.getNode(x, y, -dx, 0);
                        let nextSideFirst = this.getNode(x, y, -dx, dy);

                        if (sideFirst != null && nextSideFirst != null && sideFirst.id == -1 && nextSideFirst.id != -1) {
                            nextSideFirst.dx = -dx;
                            nextSideFirst.dy = dy;
                            forcedNeighbours.push(nextSideFirst);
                        }
                    }


                    let nextSecond = this.getNode(x, y, dx, 0);

                    if (nextSecond != null && nextSecond.id != -1) {
                        let sideSecond = this.getNode(x, y, 0, -dy);
                        let nextSideSecond = this.getNode(x, y, dx, -dy);

                        if (sideSecond != null && nextSideSecond != null && sideSecond.id == -1 && nextSideSecond.id != -1) {
                            nextSideSecond.dx = dx;
                            nextSideSecond.dy = -dy;
                            forcedNeighbours.push(nextSideSecond);
                        }
                    }
                }
            }
            // if (forcedNeighbours.length > 0) {
            //     console.log("Voisins forcés");
            //     console.log(forcedNeighbours);
            // }
        }

        return forcedNeighbours;
    }

    getNode(x, y, dx, dy) {
        if (x + dx >= 0 && x + dx < this.nodes.length && y + dy >= 0 && y + dy < this.nodes[0].length &&
            !this.findNodeInList(this.closeList, this.nodes[x + dx][y + dy])) return this.nodes[x + dx][y + dy];

        return null;
    }

    findNodeInList(list, targetNode) {
        let listFound = list.find((node) => { return node.isEqual(targetNode) })

        return listFound != null;
    }
}









//Ameliorations 

//Les voisins forcés sont "trop" cherché