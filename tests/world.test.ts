import World from "../engine/ecs-core/World";
import ExecuteSystem from "../engine/ecs-core/ExecuteSystem";
import Component from "../engine/ecs-core/Component";
import ReactiveSystem from "../engine/ecs-core/ReactiveSystem";
import { detectComponentChanges } from "../engine/ecs-core/DetectComponentChanges";
import { SystemBundle } from "../engine/ecs-core/SystemBundle";

let world: World;

beforeEach(() => {
    world = new World();
})

test("add entity", () => {
    world.addEntity();
    world.addEntity();
    expect(world.entities.length).toBe(2);
});

class TestSystem extends ExecuteSystem {
    updateCallback: Function;

    constructor(world: World, updateCallback: Function) {
        super(world);
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
    world.addExecuteSystem(TestSystem, updateCallback);
    world.update(0);
    world.update(0);
    expect(updateCallback).toBeCalledTimes(2);
});

class TestComponent extends Component { }
class TestComponent1 extends Component { }

test("awake group system", () => {
    const updateCallback = jest.fn();
    world.addExecuteSystem(TestSystem1, updateCallback);
    const entity = world.addEntity();
    world.update(0);
    entity.addComponent(TestComponent);
    expect(updateCallback).toBeCalledTimes(0);
    world.update(0);
    expect(updateCallback).toBeCalledTimes(1);
    entity.removeAllComponents();
    world.update(0);
    entity.addComponent(TestComponent1);
    world.update(0);
    expect(updateCallback).toBeCalledTimes(1);
});

test("remove entity", () => {
    const entity = world.addEntity().addComponent(TestComponent);
    const group = world.addGroup([TestComponent]);
    expect(group.matchingEntities).toEqual([entity]);
    world.removeEntity(entity);
    expect(group.matchingEntities.length).toBe(0);
});

test("remove system", () => {
    const entity = world.addEntity().addComponent(TestComponent);
    const system = world.addExecuteSystem(TestSystem1, () => { });
    world.removeExecuteSystem(TestSystem1);
    expect(world["awakeSystems"]).not.toContain(system);
    expect(Array.from(world["systems"].keys())).not.toContain(TestSystem1);
    expect(world.groups).toHaveLength(0);
});

test("remove always awake system", () => {
    const system = world.addExecuteSystem(TestSystem, () => { });
    world.removeExecuteSystem(TestSystem);
    expect(world["alwaysAwakeSystems"]).not.toContain(system);
});

class ReactiveTestSystem extends ReactiveSystem {
    getComponentsToReact() {
        return [TestComponent];
    }
}

test("reactive system", () => {
    const system = world.addReactiveSystem(ReactiveTestSystem);
    system.onComponentAdded = jest.fn();
    system.onComponentRemoved = jest.fn();
    world.active = true;
    const entity = world.addEntity().addComponent(TestComponent).addComponent(TestComponent1);
    entity.removeAllComponents();
    world.addEntity().addComponent(TestComponent);
    expect(system.onComponentAdded).toBeCalledTimes(2);
    expect(system.onComponentRemoved).toBeCalledTimes(1);
});

@detectComponentChanges
class TrackComponent extends Component {
    a: number;

    constructor(a: number) {
        super();
        this.a = a;
    }
}

class TrackTestSystem extends ReactiveSystem {
    getComponentsToReact() {
        return [TrackComponent];
    }
}

test("reactive system onChange", () => {
    const system = world.addReactiveSystem(TrackTestSystem);
    system.onComponentChanged = jest.fn();
    world.active = true;
    const entity = world.addEntity().addComponent(TestComponent).addComponent(TrackComponent, 1);
    const component = entity.getComponent(TrackComponent) as TrackComponent;
    component.a += 3;
    expect(system.onComponentChanged).toBeCalledTimes(1);
    expect(component.a).toEqual(4);
});

test("cleanup", () => {
    const entity1 = world.addEntity();
    const entity2 = world.addEntity();
    entity1.addComponent(TestComponent);
    entity2.addComponent(TestComponent1);
    world.cleanUpComponentStack.push([entity1, TestComponent]);
    world.cleanUpEntityStack.push(entity2);
    world.update(0);
    expect(world.entities).toEqual([entity1]);
    expect(entity1.hasComponents([TestComponent])).toBeFalsy();
});



test("system bundle", () => {
    class BundleSystem extends ExecuteSystem {
        update() { }
    };
    class BundleSystem1 extends ExecuteSystem {
        update() { }
    };
    const bundle: SystemBundle = () => {
        return [[TrackTestSystem], [BundleSystem, BundleSystem1]];
    };

    world.addSystemBundle(bundle);

    expect(world["alwaysAwakeSystems"].keys()).toContain(BundleSystem);
    expect(world["alwaysAwakeSystems"].keys()).toContain(BundleSystem1);
    expect(world["reactiveSystemComponentInstances"].keys()).toContain(TrackTestSystem);
})