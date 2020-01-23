import { SystemBundle } from "../ecs-core/SystemBundle";
import CanvasInitSystem from "./CanvasInitSystem";
import ImageLoaderSystem from "./ImageLoaderSystem";
import CanvasRendererSystem from "./CanvasRendererSystem";

export default function getRendererBundle(): SystemBundle {
    return () => [[CanvasInitSystem, ImageLoaderSystem], [CanvasRendererSystem]];
}