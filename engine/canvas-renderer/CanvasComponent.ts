import Component from "../ecs-core/Component";

export default class CanvasComponent extends Component {
    private _canvas: HTMLCanvasElement;
    backgroundColor = "black";

    get canvas() {
        return this._canvas;
    }

    constructor(canvas: HTMLCanvasElement) {
        super();
        this._canvas = canvas;
    }
}