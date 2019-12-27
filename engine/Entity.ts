import Component from "./Component";
import IComponentConstructor from "./IComponentConstructor";

export default class Entity {
    private components: Map<IComponentConstructor, Component>;

    constructor() {
        this.components = new Map();
    }

    hasComponents(componentConstructors: IComponentConstructor[]) {
        return componentConstructors.every(
            (componentConstructor) => this.components.has(componentConstructor));
    }

    addComponent(componentConstructor: IComponentConstructor, ...args: any) {
        this.components.set(componentConstructor, new componentConstructor(args));
        return this;
    }

    getComponent(componentConstructor: IComponentConstructor){
        return this.components.get(componentConstructor);
    }

    removeComponent(componentConstructor: IComponentConstructor){
        this.components.delete(componentConstructor);
        return this;
    }
}