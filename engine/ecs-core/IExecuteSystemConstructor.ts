import World from "./World";
import ExecuteSystem from "./ExecuteSystem";

export default interface IExecuteSystemConstructor {
    new(world: World, ...args: any[]): ExecuteSystem
}