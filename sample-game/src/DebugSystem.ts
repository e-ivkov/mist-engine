import System from "../../engine/System";
import Entity from "../../engine/Entity";
import DebugMessage from "./DebugMessage";
import Scene from "../../engine/Scene";
import Group from "../../engine/Group";

export default class DebugSystem extends System {

    private debugGroup: Group;

    constructor(scene: Scene) {
        super(scene);
        this.debugGroup = scene.addGroup([DebugMessage]);
    }

    update(deltaTime: number): void {
        console.log(deltaTime);
    }
}