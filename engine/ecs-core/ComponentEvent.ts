import Entity from "./Entity";
import Component from "./Component";

export enum ComponentEvent {
    Added,
    Removed
}

export interface ComponentEventFunction {
    (entity: Entity, component: Component): void;
}