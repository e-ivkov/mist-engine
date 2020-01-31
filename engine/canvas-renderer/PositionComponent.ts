import Component from "../ecs-core/Component";
import { Vector2 } from "../CommonTypes";

export default class PositionComponent extends Component {
    position: Vector2;

    constructor(position?: Vector2) {
        super();
        this.position = position ?? Vector2.zero;
    }
}