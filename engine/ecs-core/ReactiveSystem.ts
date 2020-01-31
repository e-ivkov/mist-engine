import System from "./System";
import IComponentConstructor from "./IComponentConstructor";
import Entity from "./Entity";
import Component from "./Component";

export default abstract class ReactiveSystem extends System {

    /** 
    * @returns a set of components and when ANY of them is added to the entity the events will fire
    */
    abstract getComponentsToReact(): IComponentConstructor[];

    onComponentAdded(entity: Entity, component: Component) { }

    onComponentRemoved(entity: Entity, component: Component) { }

    onComponentChanged(entity: Entity, component: Component) { }
}