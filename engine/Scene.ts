import Entity from "./Entity";
import Group from "./Group";
import System from "./System";
import { ComponentEvent } from "./ComponentEvent";
import IComponentConstructor from "./IComponentConstructor";
import ISystemConstructor from "./ISystemConstructor";

export default class Scene {
    private _entities: Set<Entity>;
    private _groups: Set<Group>;
    private systems: Map<ISystemConstructor, System>;

    constructor() {
        this._entities = new Set();
        this._groups = new Set();
        this.systems = new Map();
    }

    addEntity(): Entity {
        const entity = new Entity(entity => this.updateGroups(entity, ComponentEvent.Added),
            entity => this.updateGroups(entity, ComponentEvent.Removed));
        this._entities.add(entity);
        return entity;
    }

    addSystem(system: ISystemConstructor): void {
        this.systems.set(system, new system(this));
    }

    addGroup(componentConstructors: IComponentConstructor[]) {
        const group = new Group(componentConstructors, Array.from(this._entities));
        this._groups.add(group);
        return group;
    }

    get groups(): ReadonlyArray<Group> {
        return Array.from(this._groups);
    }

    get entities(): ReadonlyArray<Entity> {
        return Array.from(this._entities);
    }

    entitiesWithComponents(componentConstructors: IComponentConstructor[]): ReadonlyArray<Entity> {
        return (new Group(componentConstructors, Array.from(this._entities))).matchingEntities;
    }

    removeEntity(entity: Entity) {
        return this._entities.delete(entity);
    }

    removeGroup(group: Group) {
        return this._groups.delete(group);
    }

    removeSystem(system: ISystemConstructor) {
        return this.systems.delete(system);
    }

    private updateGroups(entity: Entity, event: ComponentEvent) {
        this._groups.forEach(group => group.update(entity, event));
        console.log("Groups updated!");
    }

    update(deltaTime: number) {
        this.systems.forEach((system) => system.update(deltaTime));
    }
}