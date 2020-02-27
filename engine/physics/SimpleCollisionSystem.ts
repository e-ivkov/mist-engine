import ExecuteSystem from "../ecs-core/ExecuteSystem";
import Entity from "../ecs-core/Entity";
import { RectangleCollider } from "./Colliders";
import TransformComponent from "../positioning/TransformComponent";
import { getGlobalTransform } from "../positioning/ParentChildRelation";
import { Vector2 } from "../CommonTypes";
import CollisionMatrix from "./CollisionMatrix";
import { CollisionEvent } from "./Events";

export default class SimpleCollisionSystem extends ExecuteSystem {

    update(deltaTime: number, entities?: ReadonlyArray<Entity>) {
        let collisionMatrix = this.world.getSingletonComponent(CollisionMatrix) as (CollisionMatrix | undefined);
        if (!collisionMatrix) return;

        this.permutations(entities!.map(e => e.getComponent(RectangleCollider) as RectangleCollider))
            .forEach(pair => {
                const canCollide = collisionMatrix?.canCollide(pair[0].collisionLayer, pair[1].collisionLayer);
                const check = SimpleCollisionSystem.checkCollision(pair[0].entity!, pair[1].entity!);
                const doCollide = canCollide && check;

                if (doCollide) {
                    pair[1].entity?.addComponent(CollisionEvent, pair[0].entity);
                    pair[0].entity?.addComponent(CollisionEvent, pair[1].entity);

                    this.world.cleanUpComponentStack.push([pair[0].entity!, CollisionEvent]);
                    this.world.cleanUpComponentStack.push([pair[1].entity!, CollisionEvent]);
                }
            });
    }

    getAwakeCondition() {
        return [RectangleCollider, TransformComponent];
    }

    private permutations<T>(list: T[]): Array<[T, T]> {
        if (list.length < 2) { return []; }
        const first = list[0];
        const rest = list.slice(1);
        const pairs: Array<[T, T]> = rest.map(x => [first, x]);
        return pairs.concat(this.permutations(rest));
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