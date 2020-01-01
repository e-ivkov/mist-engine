import Scene from "../engine/ecs-core/Scene";
import ExecuteSystem from "../engine/ecs-core/ExecuteSystem";
import Component from "../engine/ecs-core/Component";

class TestSystem extends ExecuteSystem {
    addOneFrameComponent = true;

    update(deltaTime: number) {
        if (this.addOneFrameComponent) {
            const entity = this.scene.addEntity();
            entity.addComponent(TestComponent);
            this.cleanUpComponentStack.push([entity, TestComponent]);
            this.cleanUpEntityStack.push(entity);
            this.addOneFrameComponent = false;
        }
    }
}

class TestComponent extends Component { }

test("clean up", () => {
    const scene = new Scene();
    scene.addExecuteSystem(TestSystem, "always");
    scene.update(0);
    expect(scene.entitiesWithComponents([TestComponent])).toHaveLength(1);
    scene.update(0);
    expect(scene.entitiesWithComponents([TestComponent])).toHaveLength(0);
    expect(scene.entities).toHaveLength(0);
});