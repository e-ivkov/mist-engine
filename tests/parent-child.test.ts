import Entity from "../engine/ecs-core/Entity"
import { addChild, ChildrenComponent, ParentComponent } from "../engine/positioning/ParentChildRelation";

test("add child", () => {
    const empty = () => { };
    const parent = new Entity(empty, empty, empty);
    const child = new Entity(empty, empty, empty);
    addChild(parent, child);
    const parentComp = child.getComponent(ParentComponent);
    const childrenComp = parent.getComponent(ChildrenComponent)
    expect(parentComp).toBeDefined();
    expect((parentComp as ParentComponent).parent).toBe(parent);
    expect(childrenComp).toBeDefined();
    expect((childrenComp as ChildrenComponent).children.has(child)).toBeTruthy();
})