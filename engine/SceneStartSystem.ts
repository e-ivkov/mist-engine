import System from "./ecs-core/System";
import { SceneStarted } from "./EventComponents";

export default class SceneStartSystem extends System {
    startEventFired = false;

    update(deltaTime: number) {
        if (!this.startEventFired) {
            const entity = this.scene.addEntity();
            entity.addComponent(SceneStarted);
            this.cleanUpEntityStack.push(entity);
            this.startEventFired = true;
        } else {
            this.scene.removeSystem(SceneStartSystem);
        }
    }
}