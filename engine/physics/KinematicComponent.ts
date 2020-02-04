import Component from "../ecs-core/Component";
import { Vector2 } from "../CommonTypes";

/**
 * Both velocity and acceleration are per millisecond
 */
export default class KinematicComponent extends Component {
    velocity: Vector2;
    acceleration: Vector2;

    constructor(velocity?: Vector2, acceleration?: Vector2) {
        super();
        this.velocity = velocity ?? Vector2.zero;
        this.acceleration = acceleration ?? Vector2.zero;
    }
}