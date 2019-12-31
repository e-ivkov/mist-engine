import Scene from "./Scene";

export default abstract class System {

    protected scene: Scene;

    constructor(scene: Scene, ...args: any[]){
        this.scene= scene;
    }

    abstract update(deltaTime: number): void;
}