import ExecuteSystem from "../ecs-core/ExecuteSystem";
import Entity from "../ecs-core/Entity";
import AnimationComponent from "./AnimationComponent";
import ImageComponent from "../canvas-renderer/ImageComponent";
import AnimationState from "./AnimationState";

export default class AnimationSystem extends ExecuteSystem {
    update(deltaTime: number, entities?: Entity[]): void {
        entities?.forEach(e => {
            const anim = e.getComponent(AnimationComponent) as AnimationComponent;

            if (!e.getComponent(ImageComponent)) e.addComponent(ImageComponent, anim.images[0]);
            const image = e.getComponent(ImageComponent) as ImageComponent;

            if (!e.getComponent(AnimationState)) e.addComponent(AnimationState, anim.interval);
            const state = e.getComponent(AnimationState) as AnimationState;

            if (anim.running) this.animate(deltaTime, anim, image, state);
        });
    }

    private animate(deltaTime: number, anim: AnimationComponent, image: ImageComponent, state: AnimationState) {
        state.countdown -= deltaTime;
        if (state.countdown <= 0) {
            if (state.currentImage < anim.images.length - 1) {
                state.currentImage++;
            } else {
                state.currentImage = 0;
            }
            image.fileName = anim.images[state.currentImage];
            state.countdown = anim.interval;
        }
    }

    getAwakeCondition() {
        return [AnimationComponent];
    }
}