import Entity from "./Entity";
import Component from "./Component";

export enum ComponentEvent {
    Added,
    Removed,
    Changed
}

export interface ComponentEventFunction {
    (entity: Entity, component: Component): void;
}