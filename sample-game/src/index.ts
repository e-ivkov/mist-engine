import Game from "../../engine/Game";
import World from "../../engine/ecs-core/World";
import CanvasComponent from "../../engine/canvas-renderer/CanvasComponent";
import getRendererBundle from "../../engine/canvas-renderer/RendererBundle";
import ImageLoadRequest from "../../engine/canvas-renderer/ImageLoadRequest";
import ReactiveSystem from "../../engine/ecs-core/ReactiveSystem";
import { ImageLoaded } from "../../engine/canvas-renderer/EventComponents";
import ImageComponent from "../../engine/canvas-renderer/ImageComponent";
import PositionComponent from "../../engine/canvas-renderer/PositionComponent";


let world = new World();
world.addSystemBundle(getRendererBundle());

let game = new Game([world]);
game.start();

world.addEntity().addComponent(CanvasComponent, 500, 500);

world.addReactiveSystem(class extends ReactiveSystem {
    onComponentAdded() {
        this.world.addEntity().addComponent(ImageComponent, "planeRed1.png")
            .addComponent(PositionComponent, 200, 200);
    }

    getComponentToReact() {
        return ImageLoaded;
    }
})

world.addEntity().addComponent(ImageLoadRequest, ["planeRed1.png"], "assets/");





