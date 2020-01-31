import Component from "../ecs-core/Component";
import { Vector2 } from "../CommonTypes";

export default class ImageComponent extends Component {
    fileName: string;
    pivot: Vector2;

    /**
     * 
     * @param fileName 
     * @param pivot in percentage from the center of the image: 
     * (0,0) - center, (0.5, -0.5) - bottom-right, (-0.5, 0.5) - top-left
     */
    constructor(fileName: string, pivot?: Vector2) {
        super();
        this.fileName = fileName;
        this.pivot = pivot ?? Vector2.zero;
    }
}