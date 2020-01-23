import World from "./World";
import Entity from "./Entity";
import IComponentConstructor from "./IComponentConstructor";
import System from "./System";
import { AwakeCondition } from "./AwakeCondition";

export default abstract class ExecuteSystem extends System {

    abstract update(deltaTime: number): void;

    getAwakeCondition(): AwakeCondition {
        return "always";
    }
}