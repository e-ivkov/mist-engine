import Game from "../../engine/Game";
import Scene from "../../engine/Scene";
import DebugMessage from "./DebugMessage";
import DebugSystem from "./DebugSystem";


let scene = new Scene();
scene.addSystem(DebugSystem, [DebugMessage]);
scene.addEntity().addComponent(DebugMessage);

let game = new Game(scene);
game.start();



