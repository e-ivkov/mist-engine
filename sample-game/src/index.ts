import Game from "../../engine/Game";
import Scene from "../../engine/Scene";
import DebugMessage from "./DebugMessage";
import DebugSystem from "./DebugSystem";

let game = new Game();

let scene = new Scene();
scene.addSystem(DebugSystem, [DebugMessage]);
scene.update(0);
scene.addEntity().addComponent(DebugMessage);

scene.update(0);



