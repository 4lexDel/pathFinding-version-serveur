class NodeMazeDFS {
    constructor(x, y, parentNode, id) {
        this.x = x;
        this.y = y;
        this.parentNode = parentNode;
        this.id = id;
    }

    isEqual(targetNode) {
        if (this.x == targetNode.x && this.y == targetNode.y) return true;

        return false;
    }
}