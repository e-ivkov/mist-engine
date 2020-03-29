import ExecuteSystem from "../../engine/ecs-core/ExecuteSystem";
import { FlyingStarted, RockComponent } from "./Components";
import TransformComponent from "../../engine/positioning/TransformComponent";
import ImageComponent from "../../engine/canvas-renderer/ImageComponent";
import { Vector2 } from "../../engine/CommonTypes";
import CanvasComponent from "../../engine/canvas-renderer/CanvasComponent";
import { RectangleCollider } from "../../engine/physics/Colliders";
import KinematicComponent from "../../engine/physics/KinematicComponent";
import { groundVelocity } from "./Constants";

export default class RockSpawnerSystem extends ExecuteSystem {

    readonly interval = 1000;
    private countdown = this.interval;
    private upper = true;

    readonly canvas = this.world.getSingletonComponent(CanvasComponent) as CanvasComponent;

    update(deltaTime: number) {
        this.countdown -= deltaTime;
        if (this.countdown <= 0) {
            this.world.addEntity().addComponent(RockComponent)
                .addComponent(TransformComponent,
                    new Vector2(this.canvas.width / 2, this.upper ? this.canvas.height / 2 - 120 : - this.canvas.height / 2 + 120),
                    0,
                    new Vector2(1, this.upper ? -1 : 1))
                .addComponent(ImageComponent, "rock.png")
                .addComponent(RectangleCollider, 30, 210, 2)
                .addComponent(KinematicComponent, groundVelocity);
            this.countdown = this.interval;
            this.upper = !this.upper;
        }
    }

    getAwakeCondition() {
        return [FlyingStarted]
    }
}