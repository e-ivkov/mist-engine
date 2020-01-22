import Game from "../../engine/Game";
import World from "../../engine/ecs-core/World";
import DebugMessage from "./DebugMessage";
import DebugSystem from "./DebugSystem";
import CanvasInitSystem from "../../engine/canvas-renderer/CanvasInitSystem";
import CanvasRendererSystem from "../../engine/canvas-renderer/CanvasRendererSystem";
import CanvasInitRequest from "../../engine/canvas-renderer/CanvasInitRequest";


let world = new World();
world.addReactiveSystem(CanvasInitSystem);
world.addExecuteSystem(CanvasRendererSystem);

let game = new Game([world]);
game.start();

world.addEntity().addComponent(CanvasInitRequest, 500, 500);



