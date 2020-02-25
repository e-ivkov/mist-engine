import ReactiveSystem from "../ecs-core/ReactiveSystem";
import ImageLoadRequest from "./ImageLoadRequest";
import { ImagesLoaded } from "./EventComponents";
import LoadedImagesComponent from "./LoadedImagesComponent";

export default class ImageLoaderSystem extends ReactiveSystem {
    onComponentAdded() {
        this.world.entitiesWithComponents([ImageLoadRequest]).forEach(e => {
            const request = (e.getComponent(ImageLoadRequest) as ImageLoadRequest);

            let loadedImages: LoadedImagesComponent | undefined =
                this.world.getSingletonComponent(LoadedImagesComponent) as LoadedImagesComponent;
            if (!loadedImages) {
                let entity = this.world.addEntity().addComponent(LoadedImagesComponent);
                loadedImages = entity.getComponent(LoadedImagesComponent) as LoadedImagesComponent;
            }

            let numLoaded = 0;
            
            request.fileNames.forEach(fileName => {
                const image = new Image();

                image.onload = () => {
                    numLoaded++;
                    if (numLoaded >= request.fileNames.length) {
                        this.world.addEntity().addComponent(ImagesLoaded, request);
                    }
                    loadedImages!.imagesByFilename.set(fileName, image);
                };
                image.onerror = () => {
                    alert("image load error");
                }
                image.src = request.assetFolder + fileName;
            });

            e.removeComponent(ImageLoadRequest);
        });
    }

    getComponentsToReact() {
        return [ImageLoadRequest];
    }
}