import Component from "../ecs-core/Component";

/**
 * Add this component to entity to animate it. If the entity has no [[ImageComponent]], it will be added by [[AnimationSystem]]
 */
export default class AnimationComponent extends Component {
    /**
     * File names of images as they were loaded. All of them should have been loaded with [[ImageLoaderSystem]].
     * Should have at least one entry.
     */
    images: string[];
    running: boolean;

    /** Interval between showing images in milliseconds*/
    interval: number;

    constructor(images: string[], interval: number, running = true) {
        super();
        this.images = Array.from(images);
        this.interval = interval;
        this.running = running;
    }
}