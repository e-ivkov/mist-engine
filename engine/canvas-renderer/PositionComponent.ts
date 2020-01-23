import Component from "../ecs-core/Component";

export default class PositionComponent extends Component {
    x: number;
    y: number;

    constructor(x?: number, y?: number) {
        super();
        this.x = x ?? 0;
        this.y = y ?? 0;
    }
}