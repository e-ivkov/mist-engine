import Scene from "./Scene";
import Entity from "./Entity";
import IComponentConstructor from "./IComponentConstructor";

export default abstract class System {
    protected scene: Scene;

    constructor(scene: Scene, ...args: any[]) {
        this.scene = scene;
    }
}