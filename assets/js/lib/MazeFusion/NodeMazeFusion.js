class NodeMazeFusion {
    constructor(x, y, id, areaId) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.areaId = areaId;
    }

    isEqual(targetNode) {
        if (this.x == targetNode.x && this.y == targetNode.y) return true;

        return false;
    }
}