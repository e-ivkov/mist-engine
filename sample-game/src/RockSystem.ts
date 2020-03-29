import ExecuteSystem from "../../engine/ecs-core/ExecuteSystem";
import Entity from "../../engine/ecs-core/Entity";
import { RockComponent, PlayerComponent, TitleText } from "./Components";
import TransformComponent from "../../engine/positioning/TransformComponent";
import CanvasComponent from "../../engine/canvas-renderer/CanvasComponent";
import CanvasText from "../../engine/canvas-renderer/CanvasText";

export default class RockSystem extends ExecuteSystem {
    readonly canvas = this.world.getSingletonComponent(CanvasComponent) as CanvasComponent;

    update(deltaTime: number, entities?: Entity[]): void {
        const playerTransform = this.world.getSingletonComponent(PlayerComponent)?.entity?.getComponent(TransformComponent) as TransformComponent
        entities?.forEach(e => {
            const transform = e.getComponent(TransformComponent) as TransformComponent;
            const rock = e.getComponent(RockComponent) as RockComponent;
            if (transform.position.x < -this.canvas.width) {
                this.world.removeEntity(e);
            }
            if (transform.position.x < playerTransform.position.x && !rock.passed) {
                const titleText = (this.world.getSingletonComponent(TitleText)?.entity?.getComponent(CanvasText) as CanvasText);
                titleText.text = (parseInt(titleText.text) + 1).toString()
                rock.passed = true;
            }
        })
    }

    getAwakeCondition() {
        return [RockComponent]
    }
}