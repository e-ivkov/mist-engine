import ExecuteSystem from "../../engine/ecs-core/ExecuteSystem";
import Entity from "../../engine/ecs-core/Entity";
import { RockComponent } from "./Components";
import TransformComponent from "../../engine/positioning/TransformComponent";
import CanvasComponent from "../../engine/canvas-renderer/CanvasComponent";

export default class RockSystem extends ExecuteSystem {
    readonly canvas = this.world.getSingletonComponent(CanvasComponent) as CanvasComponent;

    update(deltaTime: number, entities?: Entity[]): void {
        entities?.forEach(e => {
            const transform = e.getComponent(TransformComponent) as TransformComponent;
            if (transform.position.x < -this.canvas.width) {
                this.world.removeEntity(e);
            }
        })
    }

    getAwakeCondition() {
        return [RockComponent]
    }
}