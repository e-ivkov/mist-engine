import Component from "../ecs-core/Component";

export default class CanvasInitRequest extends Component {
    private _width: number;
    private _height: number;

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    constructor(width: number, height: number) {
        super();
        this._width = width;
        this._height = height;
    }
}