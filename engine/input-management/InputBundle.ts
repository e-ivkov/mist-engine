import { SystemBundle } from "../ecs-core/SystemBundle";
import InputInitSystem from "./InputInitSystem";

export default function getInputBundle(): SystemBundle {
    return () => [[InputInitSystem], []];
}