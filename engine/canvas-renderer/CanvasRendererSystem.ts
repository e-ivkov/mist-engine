import ExecuteSystem from "../ecs-core/ExecuteSystem";
import CanvasComponent from "./CanvasComponent";
import World from "../ecs-core/World";
import Group from "../ecs-core/Group";
import TransformComponent from "../positioning/TransformComponent";
import ImageComponent from "./ImageComponent";
import LoadedImagesComponent from "./LoadedImagesComponent";
import { Vector2 } from "../CommonTypes";
import Entity from "../ecs-core/Entity";
import { ParentComponent } from "../positioning/ParentChildRelation";

/**
 * The 2D renderer that uses HTML5 Canvas component with its Canvas API.
 */
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

        context.save();
        context.translate(canvasComponent.width / 2,
            canvasComponent.height / 2);

        this.imageGroup.matchingEntities.forEach(e => {
            const image = e.getComponent(ImageComponent) as ImageComponent;
            const htmlImg = loadedImages.imagesByFilename.get(image.fileName);

            if (htmlImg) {

                context?.save();

                context?.setTransform(context.getTransform().multiply(this.getPivotGlobalTransform(e)));

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
        });

        context.restore();
    }

    /**
     * @param e entity for which we want to know global position of it's pivot point
     * 
     * @returns global transform matrix of the entities pivot relative to the sceen center
     */
    getPivotGlobalTransform(e: Entity) {
        let entity: Entity | undefined = e;
        const transforms = new Array<TransformComponent>();
        do {
            transforms.push(entity.getComponent(TransformComponent) as TransformComponent);
            entity = (entity.getComponent(ParentComponent) as (ParentComponent | undefined))?.parent;
        } while (entity)

        let matrix = new DOMMatrix();

        transforms.reverse().forEach(t => {
            //translate to pivot
            matrix.translateSelf(t.position.x,
                - t.position.y);
            matrix.rotateSelf(0, 0, t.rotation);
            matrix.scaleSelf(t.scale.x, t.scale.y);
        })

        return matrix;
    }

    getAwakeCondition() {
        return [CanvasComponent];
    }
}