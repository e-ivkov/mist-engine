import ExecuteSystem from "../ecs-core/ExecuteSystem";
import CanvasComponent from "./CanvasComponent";
import Scene from "../ecs-core/Scene";
import Group from "../ecs-core/Group";
import PositionComponent from "./PositionComponent";
import ImageComponent from "./ImageComponent";
import LoadedImagesComponent from "./LoadedImagesComponent";

export default class CanvasRendererSystem extends ExecuteSystem {

    imageGroup: Group;
    canvasGroup: Group;
    imageMapGroup: Group;

    constructor(scene: Scene) {
        super(scene);
        this.imageGroup = scene.addGroup([PositionComponent, ImageComponent]);
        this.canvasGroup = scene.addGroup([CanvasComponent]);
        this.imageMapGroup = scene.addGroup([LoadedImagesComponent]);
    }

    update(deltaTime: number) {
        const canvasComponent = this.canvasGroup.matchingEntities[0]
            .getComponent(CanvasComponent) as CanvasComponent;
        let context = canvasComponent.canvas.getContext("2d");
        if (!context) return;

        context.fillStyle = canvasComponent.backgroundColor;
        context.fillRect(0, 0, canvasComponent.canvas.width, canvasComponent.canvas.height);

        let loadedImages = this.imageMapGroup.matchingEntities[0]
            .getComponent(LoadedImagesComponent) as LoadedImagesComponent;

        this.imageGroup.matchingEntities.forEach(e => {
            const image = e.getComponent(ImageComponent) as ImageComponent;
            const pos = e.getComponent(PositionComponent) as PositionComponent;
            const htmlImg = loadedImages.imagesByFilename.get(image.fileName);
            if (htmlImg) {
                context?.drawImage(htmlImg, pos.x, pos.y);
            }
        })
    }

    getAwakeCondition() {
        return [CanvasComponent];
    }
}