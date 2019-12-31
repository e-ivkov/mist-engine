import Scene from "../engine/Scene";
import System from "../engine/System";

test("add entity", () => {
    const scene = new Scene();
    scene.addEntity();
    scene.addEntity();
    expect(scene.entities.length).toBe(2);
});

class TestSystem extends System {
    updateCallback: Function;

    constructor(scene: Scene, updateCallback: Function) {
        super(scene);
        this.updateCallback = updateCallback;
    }

    update(deltaTime: number) {
        this.updateCallback();
    }
}

test("always awake system", () => {
    const scene = new Scene();
    const updateCallback = jest.fn();
    scene.addSystem(TestSystem, "always", updateCallback);
    scene.update(0);
    scene.update(0);
    expect(updateCallback.mock.calls.length).toBe(2);
});