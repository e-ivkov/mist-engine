import ExecuteSystem from "../../engine/ecs-core/ExecuteSystem";
import World from "../../engine/ecs-core/World";
import Group from "../../engine/ecs-core/Group";
import { GroundComponent, FlyingStarted } from "./Components";
import CanvasComponent from "../../engine/canvas-renderer/CanvasComponent";
import { getRandomInt } from "./HelperFunctions";
import ImageComponent from "../../engine/canvas-renderer/ImageComponent";
import TransformComponent from "../../engine/positioning/TransformComponent";
import { Vector2 } from "../../engine/CommonTypes";
import KinematicComponent from "../../engine/physics/KinematicComponent";
import Entity from "../../engine/ecs-core/Entity";

export default class GroundSpawnerSystem extends ExecuteSystem {

    private groundGroup: Group;
    readonly groundVelocity = Vector2.left.mul(0.3);

    constructor(world: World) {
        super(world);
        this.groundGroup = world.addGroup([GroundComponent]);

        const canvas = world.getSingletonComponent(CanvasComponent) as CanvasComponent;

        const upperGroundShift = getRandomInt(canvas.width / 2);

        const uppperFirst = this.addGround(world, -upperGroundShift, true);
        this.addGround(world, -upperGroundShift + canvas.width, true, uppperFirst);

        const lowerFirst = this.addGround(world, 0, false);
        this.addGround(world, canvas.width, false, lowerFirst);
    }

    addGround(world: World, x: number, upper: boolean, prevGround?: GroundComponent) {
        const canvas = world.getSingletonComponent(CanvasComponent) as CanvasComponent;
        const groundImgHeight = 71;
        const y = upper ? canvas.height / 2 - groundImgHeight / 2 : - canvas.height / 2 + groundImgHeight / 2
        const e = world.addEntity()
            .addComponent(TransformComponent, new Vector2(x, y), 0, new Vector2(1, upper ? -1 : 1))
            .addComponent(ImageComponent, "groundGrass.png")
            .addComponent(KinematicComponent)
            .addComponent(GroundComponent, upper, prevGround);

        return e.getComponent(GroundComponent) as GroundComponent
    }

    update(deltaTime: number): void {
        const canvas = this.world.getSingletonComponent(CanvasComponent) as CanvasComponent;
        console.log("ground update");

        this.groundGroup.matchingEntities.forEach(e => {
            const kinem = e.getComponent(KinematicComponent) as KinematicComponent;
            kinem.velocity = this.groundVelocity;
            console.log(kinem.velocity);

            const ground = e.getComponent(GroundComponent) as GroundComponent;
            const tranform = e.getComponent(TransformComponent) as TransformComponent;

            if (tranform.position.x <= 0 && ground.prevGround) {
                this.world.removeEntity(ground.prevGround.entity as Entity);
                ground.prevGround = undefined
                this.addGround(this.world, tranform.position.x + canvas.width, ground.upper, ground);
            }
        })
    }

    getAwakeCondition() {
        return [FlyingStarted]
    }
}