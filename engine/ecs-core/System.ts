import World from "./World";
import Entity from "./Entity";
import IComponentConstructor from "./IComponentConstructor";

export default abstract class System {
    protected world: World;

    constructor(world: World, ...args: any[]) {
        this.world = world;
    }
}