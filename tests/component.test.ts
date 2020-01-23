import Component from "../engine/ecs-core/Component";
import World from "../engine/ecs-core/World";
import { detectComponentChanges, ChangeDetectable } from "../engine/ecs-core/DetectComponentChanges";

class TestComponent extends Component { }
class Singleton1 extends Component {
    isSingleton() {
        return true;
    }
}

class Singleton2 extends Component {
    isSingleton() {
        return true;
    }
}

test("add singleton component", () => {
    const world = new World();
    world.addEntity().addAllComponents([Singleton1, Singleton2, TestComponent]);
    expect(world.getSingletonComponent(Singleton1)).toBeDefined();
    expect(world.getSingletonComponent(Singleton2)).toBeInstanceOf(Singleton2);
    expect(world.getSingletonComponent(TestComponent)).toBeUndefined();
});

test("only one singleton component should be allowed in world", () => {
    const world = new World();
    world.addEntity().addAllComponents([Singleton1, Singleton2, TestComponent]);
    expect(() => { world.addEntity().addComponent(Singleton1) }).toThrow();
})

@detectComponentChanges
class TrackComponent extends Component {
    a = 0;
}

test("onChange function call", () => {
    const component = new TrackComponent();
    (component as any).onChange = jest.fn();
    component.a++;
    const b = component.a + 2;
    component.a = 10;
    expect((component as any).onChange).toBeCalledTimes(2);
})