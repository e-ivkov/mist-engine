import Component from "./Component";
import IComponentConstructor from "./IComponentConstructor";
import { ComponentEventFunction } from "./ComponentEvent";
import World from "./World";
import { isChangeDetectable } from "./DetectComponentChanges";

export default class Entity {
    private components: Map<IComponentConstructor, Component>;
    private componentAddedEvent: ComponentEventFunction;
    private componentRemovedEvent: ComponentEventFunction;
    private componentChangedEvent: ComponentEventFunction;
    world: World | null = null;

    constructor(componentAddedEvent: ComponentEventFunction, componentRemovedEvent: ComponentEventFunction,
        componentChangedEvent: ComponentEventFunction) {
        this.components = new Map();
        this.componentAddedEvent = componentAddedEvent;
        this.componentRemovedEvent = componentRemovedEvent;
        this.componentChangedEvent = componentChangedEvent;
    }

    hasComponents(componentConstructors: IComponentConstructor[]) {
        return componentConstructors.every(
            (componentConstructor) => this.components.has(componentConstructor));
    }

    addComponent(componentConstructor: IComponentConstructor, ...args: any) {
        const component = new componentConstructor(...args);
        component.entity = this;
        if (component.isSingleton()) {
            if (!this.world?.tryAddSingletonComponent(component)) {
                throw "Can not add singleton component ${component} to world ${world}";
            }
        }
        if (isChangeDetectable(component)) {
            component.onChange = () => this.componentChangedEvent(this, component);
        }
        this.components.set(componentConstructor, component);
        this.componentAddedEvent(this, component);
        return this;
    }

    getComponent(componentConstructor: IComponentConstructor) {
        return this.components.get(componentConstructor);
    }

    removeComponent(componentConstructor: IComponentConstructor) {
        const component = this.components.get(componentConstructor);
        if (component) {
            if (component.isSingleton()) {
                this.world?.tryRemoveSingletonComponent(componentConstructor);
            }
            this.components.delete(componentConstructor);
            this.componentRemovedEvent(this, component);
        }
        return this;
    }

    removeAllComponents() {
        const components = new Map(this.components);
        this.components.clear();
        components.forEach(c => this.componentRemovedEvent(this, c));
        return this;
    }

    addAllComponents(componentConstructors: IComponentConstructor[]) {
        componentConstructors.forEach(cc => this.addComponent(cc));
        return this;
    }
}