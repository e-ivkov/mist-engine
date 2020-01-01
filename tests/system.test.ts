import Scene from "../engine/Scene";
import System from "../engine/System";
import Component from "../engine/Component";

class TestSystem extends System {
    addOneFrameComponent = true;

    update(deltaTime: number) {
        if (this.addOneFrameComponent) {
            const entity = this.scene.addEntity();
            entity.addComponent(TestComponent);
            this.cleanUpStack.push([entity, TestComponent]);
            this.addOneFrameComponent = false;
        }
    }
}

class TestComponent extends Component { }

test("clean up", () => {
    const scene = new Scene();
    scene.addSystem(TestSystem, "always");
    scene.update(0);
    expect(scene.entitiesWithComponents([TestComponent])).toHaveLength(1);
    scene.update(0);
    expect(scene.entitiesWithComponents([TestComponent])).toHaveLength(0);
});