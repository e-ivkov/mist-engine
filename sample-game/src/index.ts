import Game from "../../engine/Game";
import Scene from "../../engine/ecs-core/Scene";
import DebugMessage from "./DebugMessage";
import DebugSystem from "./DebugSystem";
import CanvasInitSystem from "../../engine/canvas-renderer/CanvasInitSystem";
import CanvasRendererSystem from "../../engine/canvas-renderer/CanvasRendererSystem";
import CanvasInitRequest from "../../engine/canvas-renderer/CanvasInitRequest";


let scene = new Scene();
scene.addReactiveSystem(CanvasInitSystem);
scene.addExecuteSystem(CanvasRendererSystem);

let game = new Game(scene);
game.start();

scene.addEntity().addComponent(CanvasInitRequest, 500, 500);



