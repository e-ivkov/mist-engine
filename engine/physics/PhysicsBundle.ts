import { SystemBundle } from "../ecs-core/SystemBundle";
import KinematicSystem from "./KinematicSystem";
import SimpleCollisionSystem from "./SimpleCollisionSystem";
import IReactiveSystemConstructor from "../ecs-core/IReactiveSystemConstructor";
import IExecuteSystemConstructor from "../ecs-core/IExecuteSystemConstructor";

/**
 * Add this bundle to the world to get all the esential physics systems. Or if you want smaller build size, select by yourself what to add.
 */
export default class PhysicsBundle implements SystemBundle {
    get(): [IReactiveSystemConstructor[], IExecuteSystemConstructor[]] {
        return [[], [KinematicSystem, SimpleCollisionSystem]];
    }
}