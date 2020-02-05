import Game from "../../engine/Game";
import World from "../../engine/ecs-core/World";
import CanvasComponent from "../../engine/canvas-renderer/CanvasComponent";
import getRendererBundle from "../../engine/canvas-renderer/RendererBundle";
import ImageLoadRequest from "../../engine/canvas-renderer/ImageLoadRequest";
import ReactiveSystem from "../../engine/ecs-core/ReactiveSystem";
import { ImageLoaded } from "../../engine/canvas-renderer/EventComponents";
import ImageComponent from "../../engine/canvas-renderer/ImageComponent";
import TransformComponent from "../../engine/positioning/PositionComponent";
import { KeyDownEvent, MouseDownEvent } from "../../engine/input-management/EventComponents";
import Component from "../../engine/ecs-core/Component";
import Entity from "../../engine/ecs-core/Entity";
import getInputBundle from "../../engine/input-management/InputBundle";
import { Vector2 } from "../../engine/CommonTypes";
import getPhysicsBundle from "../../engine/physics/PhysicsBundle";
import KinematicComponent from "../../engine/physics/KinematicComponent";


let world = new World();
world.addSystemBundle(getRendererBundle());
world.addSystemBundle(getInputBundle());
world.addSystemBundle(getPhysicsBundle());

let game = new Game([world]);
game.start();

world.addEntity().addComponent(CanvasComponent, 500, 500);

class PlayerComponent extends Component {
    isSingleton() { return true; }
}

world.addReactiveSystem(class extends ReactiveSystem {
    onComponentAdded() {
        this.world.addEntity().addComponent(ImageComponent, "planeRed1.png")
            .addComponent(TransformComponent)
            .addComponent(PlayerComponent);
    }

    getComponentsToReact() {
        return [ImageLoaded];
    }
});

world.addReactiveSystem(class extends ReactiveSystem {

    readonly upVel = Vector2.up.mul(0.8);
    readonly gravity = Vector2.down.mul(0.002);

    onComponentAdded(e: Entity, c: Component) {
        const player = world.getSingletonComponent(PlayerComponent)?.entity;
        if (c instanceof KeyDownEvent) {
            if (c.event.key !== " ") return;
        }
        if (player) {
            const kinem = player.getComponent(KinematicComponent);
            if (!(kinem instanceof KinematicComponent)) {
                player.addComponent(KinematicComponent, this.upVel.clone(), this.gravity.clone());
            }
            else {
                kinem.velocity = this.upVel.clone();
            }
        }
    }

    getComponentsToReact() {
        return [KeyDownEvent, MouseDownEvent];
    }
});

world.addEntity().addComponent(ImageLoadRequest, ["planeRed1.png"], "assets/");





