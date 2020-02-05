import Component from "../ecs-core/Component";
import Entity from "../ecs-core/Entity";
import World from "../ecs-core/World";

export class ParentComponent extends Component {
    readonly parent: Entity;

    constructor(parent: Entity) {
        super();
        this.parent = parent;
    }
}

export class ChildrenComponent extends Component {
    readonly children: Set<Entity>;

    constructor(children: Entity[]) {
        super();
        this.children = new Set(children);
    }
}

export function getWithoutParent(world: World): ReadonlyArray<Entity> {
    return world.entities.filter(e => e.hasComponents([ParentComponent]));
}

export function addChild(parent: Entity, child: Entity) {
    child.removeComponent(ParentComponent);
    child.addComponent(ParentComponent, parent);
    if (parent.hasComponents([ChildrenComponent])) {
        (parent.getComponent(ChildrenComponent) as ChildrenComponent).children.add(child);
    }
    else {
        parent.addComponent(ChildrenComponent, [child]);
    }
}

export function removeChild(parent: Entity, child: Entity) {
    if (parent.hasComponents([ChildrenComponent])) {
        (parent.getComponent(ChildrenComponent) as ChildrenComponent).children.delete(child);
        const parentComponent = child.getComponent(ParentComponent);
        if (parentComponent && (parentComponent as ParentComponent).parent === parent) {
            return child.removeComponent(ParentComponent);
        }
        return false;
    }
    return false;
}