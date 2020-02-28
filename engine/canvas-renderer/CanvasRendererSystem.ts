import ExecuteSystem from "../ecs-core/ExecuteSystem";
import CanvasComponent from "./CanvasComponent";
import World from "../ecs-core/World";
import Group from "../ecs-core/Group";
import TransformComponent from "../positioning/TransformComponent";
import ImageComponent from "./ImageComponent";
import LoadedImagesComponent from "./LoadedImagesComponent";
import { Vector2 } from "../CommonTypes";
import { getGlobalTransform } from "../positioning/ParentChildRelation";
import CanvasText from "./CanvasText";
import Entity from "../ecs-core/Entity";

/**
 * The 2D renderer that uses HTML5 Canvas component with its Canvas API.
 */
export default class CanvasRendererSystem extends ExecuteSystem {

    imageGroup: Group;
    imageMapGroup: Group;
    textGroup: Group;

    constructor(world: World) {
        super(world);
        this.imageGroup = world.addGroup([TransformComponent, ImageComponent]);
        this.textGroup = world.addGroup([TransformComponent, CanvasText]);
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

        context.save();
        context.translate(canvasComponent.width / 2,
            canvasComponent.height / 2);

        this.imageGroup.matchingEntities.forEach(e => this.drawImage(e, loadedImages, context!));

        //text is drawn on top of images
        this.textGroup.matchingEntities.forEach(e => this.drawText(e, context!));

        context.restore();
    }

    private drawImage(e: Entity, loadedImages: LoadedImagesComponent, context: CanvasRenderingContext2D) {
        const image = e.getComponent(ImageComponent) as ImageComponent;
        const htmlImg = loadedImages.imagesByFilename.get(image.fileName);

        if (htmlImg) {

            context?.save();

            //we consider that by getting global transform we get image pivot position
            context?.setTransform(context.getTransform().multiply(getGlobalTransform(e).toDOMMatrix()));

            const imgWidth = htmlImg.width;
            const imgHeight = htmlImg.height;

            //get left top corner of image vector
            const pivotScaled = new Vector2(image.pivot.x * imgWidth, -image.pivot.y * imgHeight);
            const imgTopLeft = pivotScaled.opposite.add(new Vector2(-imgWidth / 2, -imgHeight / 2));

            //translate from the pivot taking into account its relative coordinates
            context?.drawImage(htmlImg,
                imgTopLeft.x,
                imgTopLeft.y,
                imgWidth,
                imgHeight);

            context?.restore();
        }
    }

    private drawText(e: Entity, context: CanvasRenderingContext2D) {
        const text = e.getComponent(CanvasText) as CanvasText;

        context?.save();

        //we consider that by getting global transform we get image pivot position
        context?.setTransform(context.getTransform().multiply(getGlobalTransform(e).toDOMMatrix()));

        //setup text styling
        context.font = text.font;
        context.textAlign = text.textAlign;
        context.textBaseline = text.textBaseline;
        context.direction = text.direction;
        context.fillStyle = text.fillStyle;

        //draw text
        context?.fillText(text.text, 0, 0, text.maxWidth);

        context?.restore();
    }

    getAwakeCondition() {
        return [CanvasComponent];
    }
}