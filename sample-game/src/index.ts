import Game from "../../engine/Game";
import World from "../../engine/ecs-core/World";
import CanvasComponent from "../../engine/canvas-renderer/CanvasComponent";
import ImageLoadRequest from "../../engine/canvas-renderer/ImageLoadRequest";
import ReactiveSystem from "../../engine/ecs-core/ReactiveSystem";
import { ImagesLoaded } from "../../engine/canvas-renderer/EventComponents";
import ImageComponent from "../../engine/canvas-renderer/ImageComponent";
import TransformComponent from "../../engine/positioning/TransformComponent";
import { KeyDownEvent, MouseDownEvent } from "../../engine/input-management/EventComponents";
import Component from "../../engine/ecs-core/Component";
import Entity from "../../engine/ecs-core/Entity";
import { Vector2 } from "../../engine/CommonTypes";
import PhysicsBundle from "../../engine/physics/PhysicsBundle";
import KinematicComponent from "../../engine/physics/KinematicComponent";
import CanvasText from "../../engine/canvas-renderer/CanvasText";
import InputBundle from "../../engine/input-management/InputBundle";
import RendererBundle from "../../engine/canvas-renderer/RendererBundle";
import AnimationComponent from "../../engine/animation/AnimationComponent";
import AnimationBundle from "../../engine/animation/AnimationBundle";

const planeImages = ["planeRed1.png", "planeRed2.png", "planeRed3.png"];

let world = new World();
world.addSystemBundle(new RendererBundle());
world.addSystemBundle(new InputBundle());
world.addSystemBundle(new PhysicsBundle());
world.addSystemBundle(new AnimationBundle());

let game = new Game([world]);
game.start();

world.addEntity().addComponent(CanvasComponent, 800, 480);

class PlayerComponent extends Component {
    isSingleton() { return true; }
}

class FlyingStarted extends Component {
    isSingleton() { return true; }
}

class TitleText extends Component {
    isSingleton() { return true; }
}

world.addReactiveSystem(class extends ReactiveSystem {
    onComponentAdded() {
        const player = this.world.addEntity().addComponent(AnimationComponent, planeImages, 10, false)
            .addComponent(TransformComponent, Vector2.left.mul(250))
            .addComponent(KinematicComponent)
            .addComponent(PlayerComponent);
        const titleText = this.world.addEntity()
            .addComponent(TransformComponent)
            .addComponent(TitleText)
            .addComponent(CanvasText, "TAPPY PLANE", "42px arial", "center", "#529EDE");
        const background = this.world.addEntity()
            .addComponent(TransformComponent)
            .addComponent(ImageComponent, "background.png")
    }

    getComponentsToReact() {
        return [ImagesLoaded];
    }
});

world.addReactiveSystem(class extends ReactiveSystem {

    readonly upVel = Vector2.up.mul(0.8);
    readonly gravity = Vector2.down.mul(0.002);

    private startFlying(player: Entity, world: World) {
        const kinem = player.getComponent(KinematicComponent) as KinematicComponent;
        kinem.acceleration = this.gravity.clone();

        const anim = player.getComponent(AnimationComponent) as AnimationComponent;
        anim.running = true;

        world.getSingletonComponent(TitleText)?.entity?.removeComponent(CanvasText);

        world.tryAddSingletonComponent(new FlyingStarted());
    }

    onComponentAdded(e: Entity, c: Component) {
        const player = world.getSingletonComponent(PlayerComponent)?.entity;
        if (c instanceof KeyDownEvent) {
            if (c.event.key !== " ") return;
        }
        if (player) {
            const kinem = player.getComponent(KinematicComponent) as KinematicComponent;

            if (!world.getSingletonComponent(FlyingStarted)) this.startFlying(player, world);

            kinem.velocity = this.upVel.clone();
        }
    }

    getComponentsToReact() {
        return [KeyDownEvent, MouseDownEvent];
    }
});

world.addEntity().addComponent(ImageLoadRequest, ["starGold.png", "background.png"].concat(planeImages), "assets/");





