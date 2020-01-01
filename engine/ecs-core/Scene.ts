import Entity from "./Entity";
import Group from "./Group";
import ExecuteSystem from "./ExecuteSystem";
import { ComponentEvent } from "./ComponentEvent";
import IComponentConstructor from "./IComponentConstructor";
import IExecuteSystemConstructor from "./IExecuteSystemConstructor";
import { AwakeCondition } from "./AwakeCondition";

type AwakeGroup = Group;

export default class Scene {
    private _entities: Set<Entity>;
    private _groups: Set<Group>;
    private systems: Map<IExecuteSystemConstructor, [ExecuteSystem, AwakeGroup]>;
    private awakeSystems: Set<ExecuteSystem>;
    private alwaysAwakeSystems: Map<IExecuteSystemConstructor, ExecuteSystem>;

    constructor() {
        this._entities = new Set();
        this._groups = new Set();
        this.systems = new Map();
        this.awakeSystems = new Set();
        this.alwaysAwakeSystems = new Map();
    }

    addEntity(): Entity {
        const entity = new Entity(entity => this.updateGroups(entity, ComponentEvent.Added),
            entity => this.updateGroups(entity, ComponentEvent.Removed));
        this._entities.add(entity);
        return entity;
    }

    addExecuteSystem(systemConstructor: IExecuteSystemConstructor, ...args: any[]) {
        const system = new systemConstructor(this, ...args);
        const awakeCondition = system.getAwakeCondition();
        if (awakeCondition === "always") {
            this.alwaysAwakeSystems.set(systemConstructor, system);
        }
        else {
            const awakeGroup = this.addGroup(awakeCondition);
            this.systems.set(systemConstructor, [system, awakeGroup]);
            if (awakeGroup.matchingEntities.length > 0) {
                this.awakeSystems.add(system);
            }
        }
        return system;
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
        if (this._entities.delete(entity)) {
            entity.removeAllComponents();
            return true;
        }
        return false;
    }

    removeGroup(group: Group) {
        return this._groups.delete(group);
    }

    removeExecuteSystem(system: IExecuteSystemConstructor) {
        if (!this.alwaysAwakeSystems.delete(system)) {
            if (this.systems.has(system)) {
                let [s, g] = this.systems.get(system);
                this.awakeSystems.delete(s as ExecuteSystem);
                return this.systems.delete(system);

            }
            return false;
        }
        return true;
    }

    private updateGroups(entity: Entity, event: ComponentEvent) {
        this._groups.forEach(group => group.update(entity, event));
        this.updateAwakeSystems();
    }

    private updateAwakeSystems() {
        this.awakeSystems.clear();
        for (let [system, awakeGroup] of this.systems.values()) {
            if (awakeGroup.matchingEntities.length > 0) {
                this.awakeSystems.add(system);
            }
        }
    }

    update(deltaTime: number) {
        this.awakeSystems.forEach((system) => system.techUpdate(deltaTime));
        this.alwaysAwakeSystems.forEach((system) => system.techUpdate(deltaTime));
    }
}