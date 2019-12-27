import Entity from "./Entity";
import Group from "./Group";
import System from "./System";

export default class Scene {
    private entities: Entity[];
    private groups: Group[];
    private systems: System[];

    constructor(){
        this.entities = new Array();
        this.groups = new Array();
        this.systems = new Array();
    }

    addEntity(): Entity{
        const entity = new Entity();
        this.entities.push(entity);
        return entity;
    }

    addSystem(system: new () => System){
        this.systems.push(new system());
        return this;
    } 

    update(){
        this.systems.forEach((system) => system.update(this.entities));
    }
}