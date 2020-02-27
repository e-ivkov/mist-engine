import ExecuteSystem from "../ecs-core/ExecuteSystem";
import Entity from "../ecs-core/Entity";
import { RectangleCollider } from "./Colliders";
import TransformComponent from "../positioning/TransformComponent";
import { getGlobalTransform } from "../positioning/ParentChildRelation";
import { Vector2 } from "../CommonTypes";

export default class SimpleCollisionSystem extends ExecuteSystem {

    update(deltaTime: number, entities?: Entity[] | undefined): void {
        throw new Error("Method not implemented.");
    }

    getAwakeCondition() {
        return [RectangleCollider, TransformComponent];
    }

    /**
     * Right now checks only for collision between [[RectangleCollider]] components
     * 
     * @param entity1 should have both Collider and [[TranformComponent]]
     * @param entity2 same as for entity1
     * 
     * @returns true if there is a collision, false otherwise
     */
    static checkCollision(entity1: Entity, entity2: Entity) {

        const pos1 = getGlobalTransform(entity1).transformPoint(Vector2.zero);
        const pos2 = getGlobalTransform(entity2).transformPoint(Vector2.zero);

        const collider1 = entity1.getComponent(RectangleCollider) as RectangleCollider;
        const collider2 = entity2.getComponent(RectangleCollider) as RectangleCollider;

        const yDist = Math.abs(pos1.y - pos2.y);
        const xDist = Math.abs(pos1.x - pos2.x);

        const yIntersect = yDist <= (collider1.height / 2 + collider2.height / 2);
        const xIntersect = xDist <= (collider1.width / 2 + collider2.width / 2);

        return yIntersect && xIntersect;
    }
}