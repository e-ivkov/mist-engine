import Scene from "./Scene";
import System from "./System";

export default interface ISystemConstructor {
    new (scene: Scene): System
}