import Entity from "../engine/ecs-core/Entity";
import TransformComponent from "../engine/positioning/TransformComponent";
import { RectangleCollider } from "../engine/physics/Colliders";
import SimpleCollisionSystem from "../engine/physics/SimpleCollisionSystem";
import { Vector2 } from "../engine/CommonTypes";

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
        .addComponent(TransformComponent, new Vector2(4, 0))
        .addComponent(RectangleCollider, 4, 3);
    expect(SimpleCollisionSystem.checkCollision(entity1, entity2)).toBeTruthy();
});

test("rectangle collision - no collision", () => {
    const entity1 = new Entity(() => { }, () => { }, () => { })
        .addComponent(TransformComponent)
        .addComponent(RectangleCollider, 2, 3);
    const entity2 = new Entity(() => { }, () => { }, () => { })
        .addComponent(TransformComponent, new Vector2(4.1, 0))
        .addComponent(RectangleCollider, 4, 3);
    expect(SimpleCollisionSystem.checkCollision(entity1, entity2)).toBeFalsy();
});