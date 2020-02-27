import Entity from "../engine/ecs-core/Entity"
import { addChild, ChildrenComponent, ParentComponent, getGlobalTransform } from "../engine/positioning/ParentChildRelation";
import TransformComponent from "../engine/positioning/TransformComponent";
import { Vector2 } from "../engine/CommonTypes";

const empty = () => { };

test("add child", () => {
    const parent = new Entity(empty, empty, empty);
    const child = new Entity(empty, empty, empty);
    addChild(parent, child);
    const parentComp = child.getComponent(ParentComponent);
    const childrenComp = parent.getComponent(ChildrenComponent);
    expect(parentComp).toBeDefined();
    expect((parentComp as ParentComponent).parent).toBe(parent);
    expect(childrenComp).toBeDefined();
    expect((childrenComp as ChildrenComponent).children.has(child)).toBeTruthy();
});

function deltaEqual(actual: number, expected: number, delta: number) {
    return actual >= expected - delta && actual <= expected + delta;
}

test("get global transform", () => {

    const parent = new Entity(empty, empty, empty).addComponent(TransformComponent, Vector2.zero, 45, new Vector2(2, 2));
    const child = new Entity(empty, empty, empty).addComponent(TransformComponent, Vector2.up.mul(70));

    addChild(parent, child);
    let matrix = getGlobalTransform(child);
    let point = new Vector2(1, 1);
    let pos = matrix.transformPoint(point);
    let delta = Math.pow(10, -13);
    expect(deltaEqual(pos.x, 98.99494936611664, delta)).toBeTruthy();
    expect(deltaEqual(pos.y, -96.16652224137047, delta)).toBeTruthy();

});

test("transform from origin point is the same as global coordinate", () => {

    const entity = new Entity(empty, empty, empty).addComponent(TransformComponent, new Vector2(1, 2));

    let matrix = getGlobalTransform(entity);
    let point = Vector2.zero;
    let pos = matrix.transformPoint(point);
    let delta = Math.pow(10, -13);
    expect(deltaEqual(pos.x, 1, delta)).toBeTruthy();
    expect(deltaEqual(pos.y, -2, delta)).toBeTruthy();

});