import Component from "../ecs-core/Component";
import { Vector2 } from "../CommonTypes";

export default class ImageComponent extends Component {
    fileName: string;
    pivot: Vector2;
    layer: number; //drawing layer index, higher index images are drawn on top of low index ones

    /**
     * 
     * @param fileName 
     * @param pivot in percentage from the center of the image: 
     * (0,0) - center, (0.5, -0.5) - bottom-right, (-0.5, 0.5) - top-left
     */
    constructor(fileName: string, pivot?: Vector2, layer = 0) {
        super();
        this.fileName = fileName;
        this.pivot = pivot ?? Vector2.zero;
        this.layer = layer;
    }
}