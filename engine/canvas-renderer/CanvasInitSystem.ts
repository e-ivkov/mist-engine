import ReactiveSystem from "../ecs-core/ReactiveSystem";
import CanvasComponent from "./CanvasComponent";

export default class CanvasInitSystem extends ReactiveSystem {

    onComponentAdded() {
        const component = this.world.getSingletonComponent(CanvasComponent)! as CanvasComponent;

        const canvas = document.createElement('canvas');
        canvas.width = component.width;
        canvas.height = component.height;

        document.body.appendChild(canvas);

        component.canvas = canvas;
    }

    onComponentChanged() {
        const component = this.world.getSingletonComponent(CanvasComponent)! as CanvasComponent;
        component.canvas!.width = component.width;
        component.canvas!.height = component.height;
    }

    getComponentToReact() {
        return CanvasComponent;
    }
}