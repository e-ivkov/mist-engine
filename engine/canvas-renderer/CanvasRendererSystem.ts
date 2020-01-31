import ExecuteSystem from "../ecs-core/ExecuteSystem";
import CanvasComponent from "./CanvasComponent";
import World from "../ecs-core/World";
import Group from "../ecs-core/Group";
import TransformComponent from "./PositionComponent";
import ImageComponent from "./ImageComponent";
import LoadedImagesComponent from "./LoadedImagesComponent";
import { Vector2 } from "../CommonTypes";

export default class CanvasRendererSystem extends ExecuteSystem {

    imageGroup: Group;
    imageMapGroup: Group;

    constructor(world: World) {
        super(world);
        this.imageGroup = world.addGroup([TransformComponent, ImageComponent]);
        this.imageMapGroup = world.addGroup([LoadedImagesComponent]);
    }

    update(deltaTime: number) {
        const canvasComponent = this.world.getSingletonComponent(CanvasComponent)! as CanvasComponent;
        let context = canvasComponent.canvas!.getContext("2d");
        if (!context) return;

        context.fillStyle = canvasComponent.backgroundColor;
        context.fillRect(0, 0, canvasComponent.canvas!.width, canvasComponent.canvas!.height);

        const entities = this.imageMapGroup.matchingEntities;
        if (entities.length <= 0) return;
        let loadedImages = entities[0]
            .getComponent(LoadedImagesComponent) as LoadedImagesComponent;

        this.imageGroup.matchingEntities.forEach(e => {
            const image = e.getComponent(ImageComponent) as ImageComponent;
            const transform = e.getComponent(TransformComponent) as TransformComponent;
            const htmlImg = loadedImages.imagesByFilename.get(image.fileName);

            if (htmlImg) {
                const imgWidth = htmlImg.width * transform.scale.x;
                const imgHeight = htmlImg.height * transform.scale.y;

                //get left top corner of image
                const pivotScaled = new Vector2(image.pivot.x * imgWidth / 2, image.pivot.y * imgHeight / 2);
                const imgCenter = transform.position.add(pivotScaled.opposite);
                const imgTopLeft = imgCenter.add(new Vector2(-imgWidth / 2, imgWidth / 2));

                //translate from center coordiates to top-left
                context?.drawImage(htmlImg,
                    canvasComponent.width / 2 + imgTopLeft.x,
                    canvasComponent.height / 2 - imgTopLeft.y,
                    imgWidth,
                    imgHeight);
            }
        })
    }

    getAwakeCondition() {
        return [CanvasComponent];
    }
}