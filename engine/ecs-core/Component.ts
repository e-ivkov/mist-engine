import Entity from "./Entity";

export default abstract class Component {
    entity: Entity | undefined = undefined;

    isSingleton() {
        return false;
    }
}