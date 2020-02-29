import AnimationSystem from "./AnimationSystem";
import { SystemBundle } from "../ecs-core/SystemBundle";
import IReactiveSystemConstructor from "../ecs-core/IReactiveSystemConstructor";
import IExecuteSystemConstructor from "../ecs-core/IExecuteSystemConstructor";

export default class AnimationBundle implements SystemBundle {
    get(): [IReactiveSystemConstructor[], IExecuteSystemConstructor[]] {
        return [[], [AnimationSystem]];
    }
}