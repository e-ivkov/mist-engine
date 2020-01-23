import Game from "../../engine/Game";
import World from "../../engine/ecs-core/World";
import DebugMessage from "./DebugMessage";
import DebugSystem from "./DebugSystem";
import CanvasInitSystem from "../../engine/canvas-renderer/CanvasInitSystem";
import CanvasRendererSystem from "../../engine/canvas-renderer/CanvasRendererSystem";
import CanvasComponent from "../../engine/canvas-renderer/CanvasComponent";


let world = new World();
world.addReactiveSystem(CanvasInitSystem);
world.addExecuteSystem(CanvasRendererSystem);

let game = new Game([world]);
game.start();

world.addEntity().addComponent(CanvasComponent, 500, 500);

const canvasComponent = world.getSingletonComponent(CanvasComponent)! as CanvasComponent;

document.onclick = () => {
    canvasComponent.width += 10;
};



