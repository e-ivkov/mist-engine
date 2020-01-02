import Component from "../engine/ecs-core/Component";
import Entity from "../engine/ecs-core/Entity";

class TestComponent extends Component { }
class TestComponent1 extends Component { }
class TestComponent2 extends Component { }

test("component added", () => {
    const entity = new Entity(() => { }, () => { });
    entity.addComponent(TestComponent);
    expect(entity.getComponent(TestComponent)).toBeInstanceOf(TestComponent);
});

test("component event callbacks called right number of times", () => {
    const callbackAdded = jest.fn();
    const callbackRemoved = jest.fn();
    const entity = new Entity(callbackAdded, callbackRemoved);
    entity.addComponent(TestComponent)
        .addAllComponents([TestComponent1, TestComponent2])
        .removeAllComponents();
    expect(callbackAdded).toBeCalledTimes(3);
    expect(callbackRemoved).toBeCalledTimes(3);
});

test("has components true", () => {
    const entity = new Entity(() => { }, () => { });
    entity.addAllComponents([TestComponent, TestComponent1, TestComponent2]);
    expect(entity.hasComponents([TestComponent2, TestComponent1])).toBeTruthy();
});

test("has components false", () => {
    const entity = new Entity(() => { }, () => { });
    entity.addAllComponents([TestComponent, TestComponent1]);
    expect(entity.hasComponents([TestComponent2, TestComponent])).toBeFalsy();
});