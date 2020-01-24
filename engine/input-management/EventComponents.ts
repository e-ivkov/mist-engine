import Component from "../ecs-core/Component";

class KeyboardEventComponent extends Component {
    readonly event: KeyboardEvent;

    constructor(event: KeyboardEvent) {
        super();
        this.event = event;
    }
}

export class KeyDownEvent extends KeyboardEventComponent { }
export class KeyUpEvent extends KeyboardEventComponent { }
export class KeyPressEvent extends KeyboardEventComponent { }