import Component from "../ecs-core/Component";

/**
 * Simple rectangle collider, doesn't rotate or scale, but is correctly placed in the origin of it's entity according to parent-child relationships.
 * Both width and height scale from the point of origin in the center, so on both sides of the point it will be of length height/2 and width/2.
 */
export class RectangleCollider extends Component {
    width: number;
    height: number;

    constructor(width = 0, height = 0) {
        super();
        this.width = width;
        this.height = height;
    }
}