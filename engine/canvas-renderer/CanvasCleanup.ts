import ReactiveSystem from "../ecs-core/ReactiveSystem";
import { WorldRemoved } from "../EventComponents";
import Entity from "../ecs-core/Entity";
import Component from "../ecs-core/Component";
import CanvasComponent from "./CanvasComponent";

export default class CanvasCleanup extends ReactiveSystem {

    onComponentAdded(e: Entity, c: Component) {
        (this.world.getSingletonComponent(CanvasComponent) as CanvasComponent).canvas?.remove();
    }

    getComponentsToReact() {
        return [WorldRemoved]
    }

}