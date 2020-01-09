import Scene from "../engine/ecs-core/Scene";
import ExecuteSystem from "../engine/ecs-core/ExecuteSystem";
import Component from "../engine/ecs-core/Component";
import ReactiveSystem from "../engine/ecs-core/ReactiveSystem";

let scene: Scene;

beforeEach(() => {
    scene = new Scene();
})

test("add entity", () => {
    scene.addEntity();
    scene.addEntity();
    expect(scene.entities.length).toBe(2);
});

class TestSystem extends ExecuteSystem {
    updateCallback: Function;

    constructor(scene: Scene, updateCallback: Function) {
        super(scene);
        this.updateCallback = updateCallback;
    }

    update(deltaTime: number) {
        this.updateCallback();
    }
}

class TestSystem1 extends TestSystem {
    getAwakeCondition() {
        return [TestComponent];
    }
}

test("always awake system", () => {
    const updateCallback = jest.fn();
    scene.addExecuteSystem(TestSystem, updateCallback);
    scene.update(0);
    scene.update(0);
    expect(updateCallback).toBeCalledTimes(2);
});

class TestComponent extends Component { }
class TestComponent1 extends Component { }

test("awake group system", () => {
    const updateCallback = jest.fn();
    scene.addExecuteSystem(TestSystem1, updateCallback);
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
    const system = scene.addExecuteSystem(TestSystem1, () => { });
    scene.removeExecuteSystem(TestSystem1);
    expect(scene["awakeSystems"]).not.toContain(system);
    expect(Array.from(scene["systems"].keys())).not.toContain(TestSystem1);
    expect(scene.groups).toHaveLength(0);
});

test("remove always awake system", () => {
    const system = scene.addExecuteSystem(TestSystem, () => { });
    scene.removeExecuteSystem(TestSystem);
    expect(scene["alwaysAwakeSystems"]).not.toContain(system);
});

class ReactiveTestSystem extends ReactiveSystem {
    getComponentToReact() {
        return TestComponent;
    }
}

test("reactive system", () => {
    const system = scene.addReactiveSystem(ReactiveTestSystem);
    system.onComponentAdded = jest.fn();
    system.onComponentRemoved = jest.fn();
    scene.active = true;
    const entity = scene.addEntity().addComponent(TestComponent).addComponent(TestComponent1);
    entity.removeAllComponents();
    scene.addEntity().addComponent(TestComponent);
    expect(system.onComponentAdded).toBeCalledTimes(2);
    expect(system.onComponentRemoved).toBeCalledTimes(1);
});

test("cleanup", () => {
    const entity1 = scene.addEntity();
    const entity2 = scene.addEntity();
    entity1.addComponent(TestComponent);
    entity2.addComponent(TestComponent1);
    scene.cleanUpComponentStack.push([entity1, TestComponent]);
    scene.cleanUpEntityStack.push(entity2);
    scene.update(0);
    expect(scene.entities).toEqual([entity1]);
    expect(entity1.hasComponents([TestComponent])).toBeFalsy();
})