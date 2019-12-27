import IComponentConstructor from "./IComponentConstructor";
import Entity from "./Entity";

export default abstract class System {

    abstract update(entities: Entity[]): void;
}