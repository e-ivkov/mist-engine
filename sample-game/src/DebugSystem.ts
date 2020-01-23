import ExecuteSystem from "../../engine/ecs-core/ExecuteSystem";
import Entity from "../../engine/ecs-core/Entity";
import DebugMessage from "./DebugMessage";
import World from "../../engine/ecs-core/World";
import Group from "../../engine/ecs-core/Group";

export default class DebugSystem extends ExecuteSystem {

    private debugGroup: Group;

    constructor(world: World) {
        super(world);
        this.debugGroup = world.addGroup([DebugMessage]);
    }

    update(deltaTime: number): void {
        console.log(deltaTime);
    }

    getAwakeCondition() {
        return [DebugMessage];
    }
}