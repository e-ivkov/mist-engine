import Component from "../../engine/ecs-core/Component";

export class GroundComponent extends Component {
    prevGround: GroundComponent | undefined;
    upper: boolean;

    constructor(upper: boolean, nextGround?: GroundComponent) {
        super();
        this.prevGround = nextGround;
        this.upper = upper;
    }
}

export class RockComponent extends Component { }

export class PlayerComponent extends Component {
    isSingleton() { return true; }
}

export class FlyingStarted extends Component {
    isSingleton() { return true; }
}

export class TitleText extends Component {
    isSingleton() { return true; }
}