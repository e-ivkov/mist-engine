import IComponentConstructor from "./IComponentConstructor";
import Entity from "./Entity";
import { ComponentEvent } from "./ComponentEvent";

export default class Group {

    private _matchingEntities: Set<Entity>;

    get matchingEntities(): ReadonlyArray<Entity> {
        return Array.from(this._matchingEntities);
    }

    private componentConstructors: IComponentConstructor[];

    constructor(componentConstructors: IComponentConstructor[], entities: Entity[]) {
        this.componentConstructors = componentConstructors;
        this._matchingEntities = new Set(entities.filter(e => this.checkEntity(e)));
    }

    private checkEntity(entity: Entity) {
        return this.componentConstructors.every(cc => entity.getComponent(cc) != undefined);
    }

    update(entity: Entity, event: ComponentEvent) {
        if (event === ComponentEvent.Added) {
            if (this.checkEntity(entity)) {
                this._matchingEntities.add(entity);
            }
        } else if (event === ComponentEvent.Removed) {
            if (this._matchingEntities.has(entity) && !this.checkEntity(entity)) {
                this._matchingEntities.delete(entity);
            }
        }
    }
}