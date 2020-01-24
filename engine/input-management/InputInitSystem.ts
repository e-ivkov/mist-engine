import ReactiveSystem from "../ecs-core/ReactiveSystem";
import { WorldStarted } from "../EventComponents";
import { KeyDownEvent, KeyPressEvent, KeyUpEvent } from "./EventComponents";

export default class InputInitSystem extends ReactiveSystem {

    onComponentAdded() {
        document.addEventListener("keydown", e => this.world.addEntity().addComponent(KeyDownEvent, e));
        document.addEventListener("keypress", e => this.world.addEntity().addComponent(KeyPressEvent, e));
        document.addEventListener("keyup", e => this.world.addEntity().addComponent(KeyUpEvent, e));
    }

    getComponentToReact() {
        return WorldStarted;
    }
}