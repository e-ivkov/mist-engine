import Scene from "./Scene";
import Entity from "./Entity";
import IComponentConstructor from "./IComponentConstructor";
import System from "./System";
import { AwakeCondition } from "./AwakeCondition";

export default abstract class ExecuteSystem extends System {

    protected cleanUpComponentStack: [Entity, IComponentConstructor][];
    protected cleanUpEntityStack: Entity[];

    constructor(scene: Scene, ...args: any[]) {
        super(scene);
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

    getAwakeCondition(): AwakeCondition {
        return "always";
    }
}