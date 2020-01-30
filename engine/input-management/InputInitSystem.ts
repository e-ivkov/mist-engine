import ReactiveSystem from "../ecs-core/ReactiveSystem";
import { WorldStarted } from "../EventComponents";
import { KeyDownEvent, KeyPressEvent, KeyUpEvent, KeyboardEventComponent, MouseEventComponent, ClickEvent, DoubleClickEvent, MouseDownEvent, MouseUpEvent } from "./EventComponents";

export default class InputInitSystem extends ReactiveSystem {

    private onKeyEvent(event: KeyboardEvent, component: new (...rest: any[]) => KeyboardEventComponent) {
        const entity = this.world.addEntity().addComponent(component, event);
        this.world.cleanUpEntityStack.push(entity);
    }

    private onMouseEvent(event: MouseEvent, component: new (...rest: any[]) => MouseEventComponent) {
        const entity = this.world.addEntity().addComponent(component, event);
        this.world.cleanUpEntityStack.push(entity);
    }

    onComponentAdded() {
        document.addEventListener("keydown", e => this.onKeyEvent(e, KeyDownEvent));
        document.addEventListener("keypress", e => this.onKeyEvent(e, KeyPressEvent));
        document.addEventListener("keyup", e => this.onKeyEvent(e, KeyUpEvent));

        document.addEventListener("click", e => this.onMouseEvent(e, ClickEvent));
        document.addEventListener("dblclick", e => this.onMouseEvent(e, DoubleClickEvent));
        document.addEventListener("mousedown", e => this.onMouseEvent(e, MouseDownEvent));
        document.addEventListener("mouseup", e => this.onMouseEvent(e, MouseUpEvent));
    }

    getComponentsToReact() {
        return [WorldStarted];
    }
}