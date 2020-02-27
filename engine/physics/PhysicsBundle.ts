import { SystemBundle } from "../ecs-core/SystemBundle";
import KinematicSystem from "./KinematicSystem";
import SimpleCollisionSystem from "./SimpleCollisionSystem";

/**
 * Add this bundle to the world to get all the esential physics systems. Or if you want smaller build size, select by yourself what to add.
 */
export default function getRendererBundle(): SystemBundle {
    return () => [[], [KinematicSystem, SimpleCollisionSystem]];
}