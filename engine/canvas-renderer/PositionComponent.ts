import Component from "../ecs-core/Component";
import { Vector2 } from "../CommonTypes";

export default class TransformComponent extends Component {
    position: Vector2;
    rotation: number;
    scale: Vector2;

    constructor(position?: Vector2, rotation?: number, scale?: Vector2) {
        super();
        this.position = position ?? Vector2.zero;
        this.rotation = rotation ?? 0;
        this.scale = scale ?? new Vector2(1, 1);
    }
}