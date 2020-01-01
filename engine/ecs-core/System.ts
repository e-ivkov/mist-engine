import Scene from "./Scene";
import Entity from "./Entity";
import IComponentConstructor from "./IComponentConstructor";

export default abstract class System {

    protected scene: Scene;
    protected cleanUpComponentStack: [Entity, IComponentConstructor][];
    protected cleanUpEntityStack: Entity[];

    constructor(scene: Scene, ...args: any[]) {
        this.scene = scene;
        this.cleanUpComponentStack = new Array();
        this.cleanUpEntityStack = new Array();
    }

    techUpdate(deltaTime: number) {
        this.cleanUp();
        this.update(deltaTime);
    }

    private cleanUp() {
        this.cleanUpComponentStack.forEach(([entity, component]) => {
            entity.removeComponent(component);
        })
        this.cleanUpComponentStack = [];
        this.cleanUpEntityStack.forEach(entity => {
            this.scene.removeEntity(entity);
        });
        this.cleanUpEntityStack = [];
    }

    abstract update(deltaTime: number): void;
}