import World from "./World";
import Entity from "./Entity";
import IComponentConstructor from "./IComponentConstructor";
import System from "./System";
import { AwakeCondition } from "./AwakeCondition";

export default abstract class ExecuteSystem extends System {

    abstract update(deltaTime: number): void;

    /**
     * @returns "always" if system executes every frame, or a set of components,
     * then the system will execute only when ALL components in the list are on some entity
     */
    getAwakeCondition(): AwakeCondition {
        return "always";
    }
}