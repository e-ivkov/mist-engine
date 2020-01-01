import ExecuteSystem from "./ecs-core/ExecuteSystem";
import { SceneStarted } from "./EventComponents";

export default class SceneStartSystem extends ExecuteSystem {
    startEventFired = false;

    update(deltaTime: number) {
        if (!this.startEventFired) {
            const entity = this.scene.addEntity();
            entity.addComponent(SceneStarted);
            this.cleanUpEntityStack.push(entity);
            this.startEventFired = true;
        } else {
            this.scene.removeExecuteSystem(SceneStartSystem);
        }
    }
}