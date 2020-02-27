import World from "./World";
import Entity from "./Entity";
import IComponentConstructor from "./IComponentConstructor";
import System from "./System";
import { AwakeCondition } from "./AwakeCondition";
import Component from "./Component";

export default abstract class ExecuteSystem extends System {

    /**
     * 
     * @param deltaTime time between previous and current frames in milliseconds
     * @param etities Entities that match awake condition, e.g. have all the components listed there on them. Or undefined if awake condition is always.
     */
    abstract update(deltaTime: number, entities?: ReadonlyArray<Entity>): void;

    /**
     * @returns "always" if system executes every frame, or a set of components,
     * then the system will execute only when ALL components in the list are on some entity
     */
    getAwakeCondition(): AwakeCondition {
        return "always";
    }
}