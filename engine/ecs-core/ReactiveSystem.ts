import System from "./System";
import IComponentConstructor from "./IComponentConstructor";
import Entity from "./Entity";
import Component from "./Component";

export default abstract class ReactiveSystem extends System {

    abstract getComponentToReact(): IComponentConstructor;

    onComponentAdded(entity: Entity, component: Component) { }

    onComponentRemoved(entity: Entity, component: Component) { }

    onComponentChanged(entity: Entity, component: Component) { }
}