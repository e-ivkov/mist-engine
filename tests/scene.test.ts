import Scene from "../engine/Scene";
import System from "../engine/System";
import Component from "../engine/Component";

let scene: Scene;

beforeEach(() => {
    scene = new Scene();
})

test("add entity", () => {
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
    const updateCallback = jest.fn();
    scene.addSystem(TestSystem, "always", updateCallback);
    scene.update(0);
    scene.update(0);
    expect(updateCallback).toBeCalledTimes(2);
});

class TestComponent extends Component { }
class TestComponent1 extends Component { }

test("awake group system", () => {
    const updateCallback = jest.fn();
    scene.addSystem(TestSystem, [TestComponent], updateCallback);
    const entity = scene.addEntity();
    scene.update(0);
    entity.addComponent(TestComponent);
    expect(updateCallback).toBeCalledTimes(0);
    scene.update(0);
    expect(updateCallback).toBeCalledTimes(1);
    entity.removeAllComponents();
    scene.update(0);
    entity.addComponent(TestComponent1);
    scene.update(0);
    expect(updateCallback).toBeCalledTimes(1);
});

test("remove entity", () => {
    const entity = scene.addEntity().addComponent(TestComponent);
    const group = scene.addGroup([TestComponent]);
    expect(group.matchingEntities).toEqual([entity]);
    scene.removeEntity(entity);
    expect(group.matchingEntities.length).toBe(0);
});

test("remove system", () => {
    const entity = scene.addEntity().addComponent(TestComponent);
    const system = scene.addSystem(TestSystem, [TestComponent], () => { });
    scene.removeSystem(TestSystem);
    expect(scene["awakeSystems"]).not.toContain(system);
    expect(Array.from(scene["systems"].keys())).not.toContain(TestSystem);
});

test("remove always awake system", () => {
    const system = scene.addSystem(TestSystem, "always", () => { });
    scene.removeSystem(TestSystem);
    expect(scene["alwaysAwakeSystems"]).not.toContain(system);
});