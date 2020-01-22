import ReactiveSystem from "../ecs-core/ReactiveSystem";
import ImageLoadRequest from "./ImageLoadRequest";
import { ImageLoaded } from "./EventComponents";
import LoadedImagesComponent from "./LoadedImagesComponent";

export default class ImageLoaderSystem extends ReactiveSystem {
    onComponentAdded() {
        this.world.entitiesWithComponents([ImageLoadRequest]).forEach(e => {
            const request = (e.getComponent(ImageLoadRequest) as ImageLoadRequest);

            //TODO: check if this entity exists if so add to it
            const loadedImagesEntity = this.world.addEntity().addComponent(LoadedImagesComponent);
            const loadedImages = loadedImagesEntity.getComponent(LoadedImagesComponent) as LoadedImagesComponent;

            request.fileNames.forEach(fileName => {
                const image = new Image();
                let numLoaded = 0;
                image.onload = () => {
                    numLoaded++;
                    if (numLoaded >= request.fileNames.length) {
                        this.world.addEntity().addComponent(ImageLoaded, request);
                    }
                    loadedImages.imagesByFilename.set(fileName, image);
                };
                image.src = request.assetFolder + fileName;
            })
        })
    }

    getComponentToReact() {
        return ImageLoadRequest;
    }
}