import System from "../../engine/System";
import Entity from "../../engine/Entity";
import DebugMessage from "./DebugMessage";

export default class DebugSystem extends System{
    update(entities: Entity[]): void{
        entities.forEach((entity) => {
            const msg = entity.getComponent(DebugMessage);
            if(msg != undefined) console.log((msg as DebugMessage).message);      
        })
    }
}