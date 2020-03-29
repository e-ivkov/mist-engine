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
import { SystemBundle, SystemArgs } from "./SystemBundle";

type AwakeGroup = Group;

export default class World {
    private _entities: Set<Entity>;
    private _groups: Set<Group>;
    private systems: Map<IExecuteSystemConstructor, [ExecuteSystem, AwakeGroup]>;
    private awakeSystems: Set<ExecuteSystem>;
    private alwaysAwakeSystems: Map<IExecuteSystemConstructor, ExecuteSystem>;
    private componentReactiveSystem: Map<IComponentConstructor, Set<ReactiveSystem>>;
    private reactiveSystemComponentInstances: Map<IReactiveSystemConstructor, [IComponentConstructor[], ReactiveSystem]>;
    private _singletonComponents: Map<IComponentConstructor, Component>;
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
        this.reactiveSystemComponentInstances = new Map();
        this._singletonComponents = new Map();

        this.cleanUpComponentStack = new Array();
        this.cleanUpEntityStack = new Array();
    }

    getSingletonComponent(componentCons: IComponentConstructor) {
        return this._singletonComponents.get(componentCons);
    }

    addSingletonComponent(componentCons: IComponentConstructor, ...args: any) {
        const entity = this.addEntity().addComponent(componentCons, ...args);
    }

    /** 
     * For internal use only
    */
    tryEnlistSingletonComponent(component: Component): boolean {
        if (this._singletonComponents.has(component.constructor as IComponentConstructor)) {
            return false;
        }
        this._singletonComponents.set(component.constructor as IComponentConstructor, component);
        return true;
    }

    tryRemoveSingletonComponent(componentCons: IComponentConstructor): boolean {
        return this._singletonComponents.delete(componentCons);
    }

    addEntity(): Entity {
        const entity = new Entity((e, c) => this.onComponentEvent(e, c, ComponentEvent.Added),
            (e, c) => this.onComponentEvent(e, c, ComponentEvent.Removed),
            (e, c) => this.onComponentEvent(e, c, ComponentEvent.Changed));
        this._entities.add(entity);
        entity.world = this;
        return entity;
    }

    onComponentEvent(entity: Entity, component: Component, componentEvent: ComponentEvent) {
        if (componentEvent !== ComponentEvent.Changed)
            this.updateGroups(entity, componentEvent);

        if (!this.active) return;

        this.componentReactiveSystem.get(component.constructor as IComponentConstructor)?.forEach((system) => {
            switch (componentEvent) {
                case ComponentEvent.Added:
                    system.onComponentAdded(entity, component);
                    break;
                case ComponentEvent.Removed:
                    system.onComponentRemoved(entity, component);
                    break;
                case ComponentEvent.Changed:
                    system.onComponentChanged(entity, component);
                    break;
            }
        });
    }

    addSystemBundle(bundle: SystemBundle, systemArgs?: SystemArgs) {
        const [reactSystems, executeSystems] = bundle.get();
        reactSystems.forEach(s => {
            const args = systemArgs?.get(s);
            if (args) {
                this.addReactiveSystem(s, ...args);
            }
            else {
                this.addReactiveSystem(s);
            }
        });

        executeSystems.forEach(s => {
            const args = systemArgs?.get(s);
            if (args) {
                this.addExecuteSystem(s, ...args);
            }
            else {
                this.addExecuteSystem(s);
            }
        })
    }

    addReactiveSystem(systemConstructor: IReactiveSystemConstructor, ...args: any[]) {
        const system = new systemConstructor(this, ...args);
        const components = system.getComponentsToReact();
        this.reactiveSystemComponentInstances.set(systemConstructor, [components, system]);
        components.forEach(component => {
            if (this.componentReactiveSystem.has(component)) {
                this.componentReactiveSystem.get(component)?.add(system);
            }
            else {
                this.componentReactiveSystem.set(component, new Set([system]));
            }
        });
        return system;
    }

    removeReactiveSystem(systemConstructor: IReactiveSystemConstructor) {
        const [components, system] = this.reactiveSystemComponentInstances.get(systemConstructor);
        this.reactiveSystemComponentInstances.delete(systemConstructor);
        if (system === undefined) return false;
        (components as IComponentConstructor[]).forEach(component => {
            this.componentReactiveSystem
                .get(component as IComponentConstructor)
                ?.delete(system as ReactiveSystem);
        });
        return true;
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
                this.removeGroup(g as Group);
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

        const awakeSystems = Array.from(this.awakeSystems.values());

        for (let i = 0; i < awakeSystems.length; i++) {
            const [system, group]: [ExecuteSystem, Group] = this.systems.get(awakeSystems[i].constructor as IExecuteSystemConstructor)!
            system.update(deltaTime, group.matchingEntities);
        }

        this.alwaysAwakeSystems.forEach((system) => system.update(deltaTime));

        if (this.cleanUpComponentStack.length > 0 || this.cleanUpEntityStack.length > 0) {
            this.cleanUp();
        }
    }
}