import { SystemBundle } from "../ecs-core/SystemBundle";
import InputInitSystem from "./InputInitSystem";
import IReactiveSystemConstructor from "../ecs-core/IReactiveSystemConstructor";
import IExecuteSystemConstructor from "../ecs-core/IExecuteSystemConstructor";

export default class InputBundle implements SystemBundle {
    get(): [IReactiveSystemConstructor[], IExecuteSystemConstructor[]] {
        return [[InputInitSystem], []];
    }
}