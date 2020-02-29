import Component from "../ecs-core/Component";

/**
 * @internal
 * 
 * Managed by [[AnimationSystem]]. Should not be mannually created. Modify at runtime at your own risk.
 */
export default class AnimationState extends Component {
    currentImage: number = 0;

    /** 
     * Milliseconds left before next image
     */
    countdown: number;

    constructor(countdown: number = 0) {
        super();
        this.countdown = countdown;
    }
}