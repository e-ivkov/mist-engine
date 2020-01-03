import Entity from "./Entity";
import Group from "./Group";
import ExecuteSystem from "./ExecuteSystem";
import { ComponentEvent } from "./ComponentEvent";
import IComponentConstructor from "./IComponentConstructor";
import IExecuteSystemConstructor from "./IExecuteSystemConstructor";
import { AwakeCondition } from "./AwakeCondition";
import ReactiveSystem from "./ReactiveSystem";
import IReactiveSystemConstructor from "./IReactiveSystemConstructor";
import Component from "./Component";

type AwakeGroup = Group;

export default class Scene {
    private _entities: Set<Entity>;
    private _groups: Set<Group>;
    private systems: Map<IExecuteSystemConstructor, [ExecuteSystem, AwakeGroup]>;
    private awakeSystems: Set<ExecuteSystem>;
    private alwaysAwakeSystems: Map<IExecuteSystemConstructor, ExecuteSystem>;
    private componentReactiveSystem: Map<IComponentConstructor, Set<ReactiveSystem>>;
    private reactiveSystemComponentInstance: Map<IReactiveSystemConstructor, [IComponentConstructor, ReactiveSystem]>;
    cleanUpComponentStack: [Entity, IComponentConstructor][];
    cleanUpEntityStack: Entity[];
    active: boolean = false;

    constructor() {
        this._entities = new Set();
        this._groups = new Set();
        this.systems = new Map();
        this.awakeSystems = new Set();
        this.alwaysAwakeSystems = new Map();
        this.componentReactiveSystem = new Map();
        this.reactiveSystemComponentInstance = new Map();

        this.cleanUpComponentStack = new Array();
        this.cleanUpEntityStack = new Array();
    }

    addEntity(): Entity {
        const entity = new Entity((e, c) => this.onComponentEvent(e, c, ComponentEvent.Added),
            (e, c) => this.onComponentEvent(e, c, ComponentEvent.Removed));
        this._entities.add(entity);
        return entity;
    }

    onComponentEvent(entity: Entity, component: Component, componentEvent: ComponentEvent) {
        this.updateGroups(entity, componentEvent);
        if (!this.active) return;
        this.componentReactiveSystem.get(component.constructor as IComponentConstructor)?.forEach((system) => {
            if (componentEvent === ComponentEvent.Added) {
                system.onComponentAdded(entity, component);
            }
            else {
                system.onComponentRemoved(entity, component);
            }
        });
    }

    addReactiveSystem(systemConstructor: IReactiveSystemConstructor, ...args: any[]) {
        const system = new systemConstructor(this, ...args);
        const component = system.getComponentToReact();
        this.reactiveSystemComponentInstance.set(systemConstructor, [component, system]);
        if (this.componentReactiveSystem.has(component)) {
            this.componentReactiveSystem.get(component)?.add(system);
        }
        else {
            this.componentReactiveSystem.set(component, new Set([system]));
        }
        return system;
    }

    removeReactiveSystem(systemConstructor: IReactiveSystemConstructor) {
        const [component, system] = this.reactiveSystemComponentInstance.get(systemConstructor);
        if (component === undefined) return false;
        return this.componentReactiveSystem
            .get(component as IComponentConstructor)
            ?.delete(system as ReactiveSystem);
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

    private cleanUp() {
        this.cleanUpComponentStack.forEach(([entity, component]) => {
            entity.removeComponent(component);
        })
        this.cleanUpComponentStack = [];
        this.cleanUpEntityStack.forEach(entity => {
            this.removeEntity(entity);
        });
        this.cleanUpEntityStack = [];
    }

    update(deltaTime: number) {
        this.awakeSystems.forEach((system) => system.update(deltaTime));
        this.alwaysAwakeSystems.forEach((system) => system.update(deltaTime));

        if (this.cleanUpComponentStack.length > 0 || this.cleanUpEntityStack.length > 0) {
            this.cleanUp();
        }
    }
}