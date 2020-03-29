import Entity from "../engine/ecs-core/Entity";
import TransformComponent from "../engine/positioning/TransformComponent";
import { RectangleCollider } from "../engine/physics/Colliders";
import SimpleCollisionSystem from "../engine/physics/SimpleCollisionSystem";
import { Vector2 } from "../engine/CommonTypes";
import World from "../engine/ecs-core/World";
import CollisionMatrix from "../engine/physics/CollisionMatrix";
import ReactiveSystem from "../engine/ecs-core/ReactiveSystem";
import { CollisionEvent } from "../engine/physics/Events";
import Component from "../engine/ecs-core/Component";

const delta = Math.pow(10, -13);

test("rectangle collision - same point", () => {
    const entity1 = new Entity(() => { }, () => { }, () => { })
        .addComponent(TransformComponent)
        .addComponent(RectangleCollider, 1, 1);
    const entity2 = new Entity(() => { }, () => { }, () => { })
        .addComponent(TransformComponent)
        .addComponent(RectangleCollider, 1, 1);
    expect(SimpleCollisionSystem.checkCollision(entity1, entity2)).toBeTruthy();
});

test("rectangle collision - border", () => {
    const entity1 = new Entity(() => { }, () => { }, () => { })
        .addComponent(TransformComponent)
        .addComponent(RectangleCollider, 2, 3);
    const entity2 = new Entity(() => { }, () => { }, () => { })
        .addComponent(TransformComponent, new Vector2(3, 0))
        .addComponent(RectangleCollider, 4, 3);
    expect(SimpleCollisionSystem.checkCollision(entity1, entity2)).toBeTruthy();
});

test("rectangle collision - no collision", () => {
    const entity1 = new Entity(() => { }, () => { }, () => { })
        .addComponent(TransformComponent)
        .addComponent(RectangleCollider, 2, 3);
    const entity2 = new Entity(() => { }, () => { }, () => { })
        .addComponent(TransformComponent, new Vector2(3 + delta, 0))
        .addComponent(RectangleCollider, 4, 3);
    expect(SimpleCollisionSystem.checkCollision(entity1, entity2)).toBeFalsy();
});

class TestSystem extends ReactiveSystem {

    onAdded: Function

    constructor(world: World, onAdded: Function) {
        super(world);
        this.onAdded = onAdded;
    }

    onComponentAdded(e: Entity, c: Component) {
        this.onAdded(e, c);
    }

    getComponentsToReact() {
        return [CollisionEvent]
    }
}

test("collision event fired correctly", () => {
    const world = new World();
    world.active = true;

    const collisionSystem = world.addExecuteSystem(SimpleCollisionSystem);

    const e1 = world.addEntity().addComponent(TransformComponent)
        .addComponent(RectangleCollider, 2, 3);
    const e2 = world.addEntity().addComponent(TransformComponent, new Vector2(2, 0))
        .addComponent(RectangleCollider, 4, 3);

    world.addSingletonComponent(CollisionMatrix);
    const matrix = world.getSingletonComponent(CollisionMatrix) as CollisionMatrix;
    matrix.setCollision(0, 0, true);

    const onAdded = jest.fn(
        (e: Entity, c: CollisionEvent) => {
            if (e === e1) expect(c.other).toBe(e2);
            else expect(c.other).toBe(e1);
        }
    );
    const system = world.addReactiveSystem(TestSystem, onAdded);

    collisionSystem.update(0, [e1, e2]);

    expect(onAdded).toBeCalledTimes(2);
});