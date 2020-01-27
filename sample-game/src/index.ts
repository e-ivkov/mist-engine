import Game from "../../engine/Game";
import World from "../../engine/ecs-core/World";
import CanvasComponent from "../../engine/canvas-renderer/CanvasComponent";
import getRendererBundle from "../../engine/canvas-renderer/RendererBundle";
import ImageLoadRequest from "../../engine/canvas-renderer/ImageLoadRequest";
import ReactiveSystem from "../../engine/ecs-core/ReactiveSystem";
import { ImageLoaded } from "../../engine/canvas-renderer/EventComponents";
import ImageComponent from "../../engine/canvas-renderer/ImageComponent";
import PositionComponent from "../../engine/canvas-renderer/PositionComponent";
import { KeyDownEvent, MouseDownEvent } from "../../engine/input-management/EventComponents";
import Component from "../../engine/ecs-core/Component";
import Entity from "../../engine/ecs-core/Entity";
import getInputBundle from "../../engine/input-management/InputBundle";


let world = new World();
world.addSystemBundle(getRendererBundle());
world.addSystemBundle(getInputBundle());

let game = new Game([world]);
game.start();

world.addEntity().addComponent(CanvasComponent, 500, 500);

class PlayerComponent extends Component {
    isSingleton() { return true; }
}

world.addReactiveSystem(class extends ReactiveSystem {
    onComponentAdded() {
        this.world.addEntity().addComponent(ImageComponent, "planeRed1.png")
            .addComponent(PositionComponent, 200, 200)
            .addComponent(PlayerComponent);
    }

    getComponentsToReact() {
        return [ImageLoaded];
    }
});

world.addReactiveSystem(class extends ReactiveSystem {
    onComponentAdded(e: Entity, c: Component) {
        const player = world.getSingletonComponent(PlayerComponent)?.entity;
        if ("key" in (c as any)["event"]) {
            if ((c as KeyDownEvent).event.key !== " ") return;
        }
        if (player) {
            const pos = player.getComponent(PositionComponent) as PositionComponent;
            pos.x += 10;
        }
    }

    getComponentsToReact() {
        return [KeyDownEvent, MouseDownEvent];
    }
});

world.addEntity().addComponent(ImageLoadRequest, ["planeRed1.png"], "assets/");





