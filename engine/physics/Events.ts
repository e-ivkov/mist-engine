import Entity from "../ecs-core/Entity";
import Component from "../ecs-core/Component";

export class CollisionEvent extends Component {
    readonly other: Entity;

    constructor(other: Entity) {
        super();
        this.other = other;
    }
}