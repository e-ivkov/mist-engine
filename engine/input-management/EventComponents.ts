import Component from "../ecs-core/Component";

export class KeyboardEventComponent extends Component {
    readonly event: KeyboardEvent;

    constructor(event: KeyboardEvent) {
        super();
        this.event = event;
    }
}

export class KeyDownEvent extends KeyboardEventComponent { }
export class KeyUpEvent extends KeyboardEventComponent { }
export class KeyPressEvent extends KeyboardEventComponent { }

export class MouseEventComponent extends Component {
    readonly event: MouseEvent;

    constructor(event: MouseEvent) {
        super();
        this.event = event;
    }
}

export class ClickEvent extends MouseEventComponent { }
export class DoubleClickEvent extends MouseEventComponent { }
export class MouseDownEvent extends MouseEventComponent { }
export class MouseUpEvent extends MouseEventComponent { }