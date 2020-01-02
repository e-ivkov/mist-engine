import Component from "./Component";
import IComponentConstructor from "./IComponentConstructor";
import { ComponentEventFunction } from "./ComponentEvent";

export default class Entity {
    private components: Map<IComponentConstructor, Component>;
    private componentAddedEvent: ComponentEventFunction;
    private componentRemovedEvent: ComponentEventFunction;

    constructor(componentAddedEvent: ComponentEventFunction, componentRemovedEvent: ComponentEventFunction) {
        this.components = new Map();
        this.componentAddedEvent = componentAddedEvent;
        this.componentRemovedEvent = componentRemovedEvent;
    }

    hasComponents(componentConstructors: IComponentConstructor[]) {
        return componentConstructors.every(
            (componentConstructor) => this.components.has(componentConstructor));
    }

    addComponent(componentConstructor: IComponentConstructor, ...args: any) {
        const component = new componentConstructor(...args);
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