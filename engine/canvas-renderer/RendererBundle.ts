import { SystemBundle } from "../ecs-core/SystemBundle";
import CanvasInitSystem from "./CanvasInitSystem";
import ImageLoaderSystem from "./ImageLoaderSystem";
import CanvasRendererSystem from "./CanvasRendererSystem";
import IReactiveSystemConstructor from "../ecs-core/IReactiveSystemConstructor";
import IExecuteSystemConstructor from "../ecs-core/IExecuteSystemConstructor";

export default class RendererBundle implements SystemBundle {
    get(): [IReactiveSystemConstructor[], IExecuteSystemConstructor[]] {
        return [[CanvasInitSystem, ImageLoaderSystem], [CanvasRendererSystem]];
    }
}