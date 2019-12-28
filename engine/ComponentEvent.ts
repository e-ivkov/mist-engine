import Entity from "./Entity";

export enum ComponentEvent{
    Added,
    Removed
}

export interface ComponentEventFunction{
    (entity: Entity): void;
}