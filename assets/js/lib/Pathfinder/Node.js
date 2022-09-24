class NodePathfinder {
    constructor(id, x, y) {
        this.id = id;

        this.x = x;
        this.y = y;
        /*---------------*/
        //this.resetSolvingInformation();
        /*---------------*/
        this.gCost = -1;
        this.hCost = -1;
        this.fCost = -1;

        this.parentNode = null;

        this.colorNode;

        this.showCost = true;
        this.useKey = false;
    }

    resetSolvingInformation() {
        this.parentNode = null;

        this.hCost = -1;
        this.gCost = -1;
        this.fCost = -1;

        //if (this.id == 3) this.id = 0;
    }

    refreshCost(currentParent, finishNode) {
        let hCostTrans = this.calculateCost(finishNode.x, finishNode.y); //Multiplier ?
        //hCostTrans = 0;
        let gCostTrans, fCostTrans;

        if (currentParent == null) gCostTrans = 0; //dans le cas de start
        else {
            gCostTrans = currentParent.gCost + this.calculateCost(currentParent.x, currentParent.y) * (this.id + 1); //AJOUT DE DIFFICULTE
        }
        //gCostTrans = 0;
        //console.log(this.id);

        fCostTrans = hCostTrans + gCostTrans;

        if (this.fCost == -1 || fCostTrans < this.fCost) {
            this.gCost = gCostTrans;
            this.hCost = hCostTrans;
            this.fCost = fCostTrans;

            this.parentNode = currentParent;
        }

        //console.log("G : " + this.gCost + " | H : " + this.hCost + " | F : " + this.fCost);
    }

    calculateCost(x, y) {
        let deltaX = Math.abs(this.x - x);
        let deltaY = Math.abs(this.y - y);

        let nbDiagonal = Math.min(deltaX, deltaY);
        let nbLine = Math.max(deltaX, deltaY) - nbDiagonal;

        return nbDiagonal * 14 + nbLine * 10;
    }

    isEqual(targetNode) {
        if (this.x == targetNode.x && this.y == targetNode.y) return true;

        return false;
    }
}