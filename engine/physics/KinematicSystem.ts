import ExecuteSystem from "../ecs-core/ExecuteSystem";
import KinematicComponent from "./KinematicComponent";
import Entity from "../ecs-core/Entity";
import PositionComponent from "../canvas-renderer/PositionComponent";

export default class KinematicSystem extends ExecuteSystem {
    update(deltaTime: number, entities: ReadonlyArray<Entity>) {
        entities.forEach(e => {
            const kinem = e.getComponent(KinematicComponent) as KinematicComponent;
            const pos = e.getComponent(PositionComponent) as PositionComponent;
            pos.position = pos.position.add(kinem.velocity.mul(deltaTime));
            kinem.velocity = kinem.velocity.add(kinem.acceleration.mul(deltaTime));
        });
    }

    getAwakeCondition() {
        return [KinematicComponent, PositionComponent];
    }
}