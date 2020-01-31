import Component from "../ecs-core/Component";
import { detectComponentChanges } from "../ecs-core/DetectComponentChanges";

@detectComponentChanges
export default class CanvasComponent extends Component {
    public canvas: HTMLCanvasElement | null = null;
    backgroundColor = "black";
    public width: number;
    public height: number;

    constructor(width: number, height: number) {
        super();
        this.width = width;
        this.height = height;
    }

    isSingleton() {
        return true;
    }
}