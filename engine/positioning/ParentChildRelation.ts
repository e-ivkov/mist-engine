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

/**
 * The only right way to add child to an entity is to use this function.
 * 
 * @param parent parent
 * @param child this entity TransformComponent will now be relative to the parent
 */
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

/**
 * The only right way to remove child from an entity is to use this function.
 * 
 * @param parent parent
 * @param child this entity TransformComponent will now be relative to the coordinate system origin point
 * @returns true if both entities indeed had a child-parent relationship and it was successfuly removed
 */
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