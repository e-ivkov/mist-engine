import Component from "../engine/ecs-core/Component";
import World from "../engine/ecs-core/World";

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