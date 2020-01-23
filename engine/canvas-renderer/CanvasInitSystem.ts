import ReactiveSystem from "../ecs-core/ReactiveSystem";
import CanvasInitRequest from "./CanvasInitRequest";
import CanvasComponent from "./CanvasComponent";

export default class CanvasInitSystem extends ReactiveSystem {

    onComponentAdded() {
        const entity = this.world.entitiesWithComponents([CanvasInitRequest])[0];
        const request = (entity.getComponent(CanvasInitRequest) as CanvasInitRequest);

        const canvas = document.createElement('canvas');
        canvas.width = request.width;
        canvas.height = request.height;

        document.body.appendChild(canvas);

        this.world.addEntity().addComponent(CanvasComponent, canvas);
    }

    getComponentToReact() {
        return CanvasInitRequest;
    }
}