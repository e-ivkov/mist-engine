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
        this.components.set(componentConstructor, new componentConstructor(args));
        this.componentAddedEvent(this);
        return this;
    }

    getComponent(componentConstructor: IComponentConstructor) {
        return this.components.get(componentConstructor);
    }

    removeComponent(componentConstructor: IComponentConstructor) {
        this.components.delete(componentConstructor);
        this.componentRemovedEvent(this);
        return this;
    }

    removeAllComponents() {
        this.components.clear();
        this.componentRemovedEvent(this);
        return this;
    }

    addAllComponents(componentConstructors: IComponentConstructor[]) {
        componentConstructors.forEach(cc => this.components.set(cc, new cc()))
        this.componentAddedEvent(this);
        return this;
    }
}