import IReactiveSystemConstructor from "./IReactiveSystemConstructor";
import IExecuteSystemConstructor from "./IExecuteSystemConstructor";

export type SystemArgs = Map<IExecuteSystemConstructor | IReactiveSystemConstructor, any[]>;

export interface SystemBundle {
    get(): [IReactiveSystemConstructor[], IExecuteSystemConstructor[]];
}