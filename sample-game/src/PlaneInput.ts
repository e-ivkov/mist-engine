import ReactiveSystem from "../../engine/ecs-core/ReactiveSystem";
import { Vector2 } from "../../engine/CommonTypes";
import KinematicComponent from "../../engine/physics/KinematicComponent";
import World from "../../engine/ecs-core/World";
import Entity from "../../engine/ecs-core/Entity";
import Component from "../../engine/ecs-core/Component";
import AnimationComponent from "../../engine/animation/AnimationComponent";
import { TitleText, FlyingStarted, PlayerComponent } from "./Components";
import CanvasText from "../../engine/canvas-renderer/CanvasText";
import { KeyDownEvent, MouseDownEvent } from "../../engine/input-management/EventComponents";

export default class PlaneInput extends ReactiveSystem {

    readonly upVel = Vector2.up.mul(0.7);
    readonly gravity = Vector2.down.mul(0.002);

    private startFlying(player: Entity, world: World) {
        const kinem = player.getComponent(KinematicComponent) as KinematicComponent;
        kinem.acceleration = this.gravity.clone();

        const anim = player.getComponent(AnimationComponent) as AnimationComponent;
        anim.running = true;

        world.getSingletonComponent(TitleText)?.entity?.removeComponent(CanvasText);

        world.addSingletonComponent(FlyingStarted);
    }

    onComponentAdded(e: Entity, c: Component) {
        const player = this.world.getSingletonComponent(PlayerComponent)?.entity;
        if (c instanceof KeyDownEvent) {
            if (c.event.key !== " ") return;
        }
        if (player) {
            const kinem = player.getComponent(KinematicComponent) as KinematicComponent;

            if (!this.world.getSingletonComponent(FlyingStarted)) this.startFlying(player, this.world);

            kinem.velocity = this.upVel.clone();
        }
    }

    getComponentsToReact() {
        return [KeyDownEvent, MouseDownEvent];
    }
}