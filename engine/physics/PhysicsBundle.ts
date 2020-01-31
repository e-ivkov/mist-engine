import { SystemBundle } from "../ecs-core/SystemBundle";
import KinematicSystem from "./KinematicSystem";

export default function getRendererBundle(): SystemBundle {
    return () => [[], [KinematicSystem]];
}