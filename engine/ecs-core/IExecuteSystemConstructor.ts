import Scene from "./Scene";
import ExecuteSystem from "./ExecuteSystem";

export default interface IExecuteSystemConstructor {
    new(scene: Scene, ...args: any[]): ExecuteSystem
}