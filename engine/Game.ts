import World from "./ecs-core/World";
import { WorldStarted, GameStarted, WorldRemoved } from "./EventComponents";

export default class Game {

    private previousTime = 0;

    private active = false;

    private _worlds: Set<World>;

    get worlds(): ReadonlyArray<World> {
        return Array.from(this._worlds);
    }

    addWorld(world: World) {
        this._worlds.add(world);
        world.active = true;
        world.addEntity().addComponent(WorldStarted);
    }

    removeWorld(world: World) {
        this._worlds.delete(world);
        world.addEntity().addComponent(WorldRemoved);
        world.active = false;
    }

    constructor(worlds: World[]) {
        this._worlds = new Set(worlds);
    }

    start() {
        this._worlds.forEach(world => {
            world.active = true;
            world.addEntity().addComponent(GameStarted)
                .addComponent(WorldStarted);
        })
        this.previousTime = window.performance.now();
        this.active = true;
        this.update();
    }

    stop() {
        this.active = false;
    }

    private update() {
        const currentTime = window.performance.now();
        this._worlds.forEach(world => world.update(currentTime - this.previousTime));
        this.previousTime = currentTime;
        if (this.active) window.requestAnimationFrame(this.update.bind(this));
    }
}