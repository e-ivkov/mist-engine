import ReactiveSystem from "../ecs-core/ReactiveSystem";
import { WorldStarted } from "../EventComponents";
import { KeyDownEvent, KeyPressEvent, KeyUpEvent, KeyboardEventComponent } from "./EventComponents";

export default class InputInitSystem extends ReactiveSystem {

    private onKeyEvent(event: KeyboardEvent, component: new (...rest: any[]) => KeyboardEventComponent) {
        const entity = this.world.addEntity().addComponent(component, event);
        this.world.cleanUpEntityStack.push(entity);
    }

    onComponentAdded() {
        document.addEventListener("keydown", e => this.onKeyEvent(e, KeyDownEvent));
        document.addEventListener("keypress", e => this.onKeyEvent(e, KeyPressEvent));
        document.addEventListener("keyup", e => this.onKeyEvent(e, KeyUpEvent));
    }

    getComponentsToReact() {
        return [WorldStarted];
    }
}