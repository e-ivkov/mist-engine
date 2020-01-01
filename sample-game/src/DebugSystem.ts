import ExecuteSystem from "../../engine/ecs-core/ExecuteSystem";
import Entity from "../../engine/ecs-core/Entity";
import DebugMessage from "./DebugMessage";
import Scene from "../../engine/ecs-core/Scene";
import Group from "../../engine/ecs-core/Group";

export default class DebugSystem extends ExecuteSystem {

    private debugGroup: Group;

    constructor(scene: Scene) {
        super(scene);
        this.debugGroup = scene.addGroup([DebugMessage]);
    }

    update(deltaTime: number): void {
        console.log(deltaTime);
    }

    getAwakeCondition() {
        return [DebugMessage];
    }
}