import World from "./ecs-core/World";
import { WorldStarted, GameStarted } from "./EventComponents";

export default class Game {

    private previousTime = 0;

    private _currentScene: World;

    get currentScene() {
        return this._currentScene;
    }

    set currentScene(scene: World) {
        this._currentScene = scene;
        this._currentScene.active = true;
        this._currentScene.addEntity().addComponent(WorldStarted);
    }

    constructor(startScene: World) {
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