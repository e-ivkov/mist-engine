import Scene from "./ecs-core/Scene";
import { SceneStarted, GameStarted } from "./EventComponents";

export default class Game {

    private previousTime = 0;

    private _currentScene: Scene;

    get currentScene() {
        return this._currentScene;
    }

    set currentScene(scene: Scene) {
        this._currentScene = scene;
        this._currentScene.active = true;
        this._currentScene.addEntity().addComponent(SceneStarted);
    }

    constructor(startScene: Scene) {
        this._currentScene = startScene;
    }

    start() {
        this.currentScene = this._currentScene;
        this._currentScene.addEntity().addComponent(GameStarted);
        this.previousTime = window.performance.now();
        this.update();
    }

    private update() {
        const currentTime = window.performance.now();
        this._currentScene.update(currentTime - this.previousTime);
        this.previousTime = currentTime;
        window.requestAnimationFrame(this.update.bind(this));
    }
}