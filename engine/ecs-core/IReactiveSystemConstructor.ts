import Scene from "./Scene";
import ReactiveSystem from "./ReactiveSystem";

export default interface IReactiveSystemConstructor {
    new(scene: Scene, ...args: any[]): ReactiveSystem
}