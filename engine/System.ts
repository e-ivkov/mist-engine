import Scene from "./Scene";
import Entity from "./Entity";
import IComponentConstructor from "./IComponentConstructor";

export default abstract class System {

    protected scene: Scene;
    protected cleanUpStack: [Entity, IComponentConstructor][];

    constructor(scene: Scene, ...args: any[]) {
        this.scene = scene;
        this.cleanUpStack = new Array();
    }

    techUpdate(deltaTime: number) {
        this.cleanUp();
        this.update(deltaTime);
    }

    private cleanUp() {
        this.cleanUpStack.forEach(([entity, component]) => {
            entity.removeComponent(component);
        })
        this.cleanUpStack = [];
    }

    abstract update(deltaTime: number): void;
}