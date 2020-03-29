import ReactiveSystem from "../../engine/ecs-core/ReactiveSystem";
import AnimationComponent from "../../engine/animation/AnimationComponent";
import TransformComponent from "../../engine/positioning/TransformComponent";
import { planeImages } from "./Constants";
import { Vector2 } from "../../engine/CommonTypes";
import KinematicComponent from "../../engine/physics/KinematicComponent";
import { PlayerComponent, TitleText } from "./Components";
import { RectangleCollider } from "../../engine/physics/Colliders";
import CanvasText from "../../engine/canvas-renderer/CanvasText";
import ImageComponent from "../../engine/canvas-renderer/ImageComponent";
import { ImagesLoaded } from "../../engine/canvas-renderer/EventComponents";

export default class InitSystem extends ReactiveSystem {
    onComponentAdded() {
        const player = this.world.addEntity().addComponent(AnimationComponent, planeImages, 10, false)
            .addComponent(TransformComponent, Vector2.left.mul(250))
            .addComponent(KinematicComponent)
            .addComponent(PlayerComponent)
            .addComponent(RectangleCollider, 50, 40);
        const titleText = this.world.addEntity()
            .addComponent(TransformComponent)
            .addComponent(TitleText)
            .addComponent(CanvasText, "TAPPY PLANE", "42px arial", "center", "#529EDE");
        const background = this.world.addEntity()
            .addComponent(TransformComponent)
            .addComponent(ImageComponent, "background.png", Vector2.zero, -1)
    }

    getComponentsToReact() {
        return [ImagesLoaded];
    }
}