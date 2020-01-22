import World from "./World";
import ReactiveSystem from "./ReactiveSystem";

export default interface IReactiveSystemConstructor {
    new(world: World, ...args: any[]): ReactiveSystem
}