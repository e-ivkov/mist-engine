import Component from "../ecs-core/Component";
import ImageLoadRequest from "./ImageLoadRequest";

export class ImagesLoaded extends Component {
    private _request: ImageLoadRequest;

    get request() {
        return this._request;
    }

    constructor(request: ImageLoadRequest) {
        super();
        this._request = request;
    }
}