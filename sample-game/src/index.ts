import Game from "../../engine/Game";
import Scene from "../../engine/ecs-core/Scene";
import DebugMessage from "./DebugMessage";
import DebugSystem from "./DebugSystem";


let scene = new Scene();
scene.addExecuteSystem(DebugSystem);
scene.addEntity().addComponent(DebugMessage);

let game = new Game(scene);
game.start();



