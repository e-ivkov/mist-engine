import Component from "../ecs-core/Component";

export default class CollisionMatrix extends Component {
    private matrix: boolean[];
    private n: number;

    constructor(nCollisionLayers: number = 1) {
        super();
        if (nCollisionLayers < 1) throw new Error("Number of collision layers should be at least 1. Got: " + nCollisionLayers);
        this.n = nCollisionLayers;
        this.matrix = new Array(Math.pow(nCollisionLayers, 2)).fill(false);
    }

    isSingleton() {
        return true;
    }

    get raw(): ReadonlyArray<boolean> {
        return this.matrix;
    }

    setCollision(layer1: number, layer2: number, collision = true) {
        this.matrix[this.n * layer1 + layer2] = collision;
        this.matrix[this.n * layer2 + layer1] = collision;
    }

    canCollide(layer1: number, layer2: number) {
        return this.matrix[this.n * layer1 + layer2];
    }
}