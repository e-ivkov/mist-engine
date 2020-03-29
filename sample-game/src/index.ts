import Game from "../../engine/Game";
import World from "../../engine/ecs-core/World";
import CanvasComponent from "../../engine/canvas-renderer/CanvasComponent";
import ImageLoadRequest from "../../engine/canvas-renderer/ImageLoadRequest";
import ReactiveSystem from "../../engine/ecs-core/ReactiveSystem";
import Component from "../../engine/ecs-core/Component";
import Entity from "../../engine/ecs-core/Entity";
import PhysicsBundle from "../../engine/physics/PhysicsBundle";
import InputBundle from "../../engine/input-management/InputBundle";
import RendererBundle from "../../engine/canvas-renderer/RendererBundle";
import AnimationBundle from "../../engine/animation/AnimationBundle";
import GroundSpawnerSystem from "./GroundSpawnerSystem";
import CollisionMatrix from "../../engine/physics/CollisionMatrix";
import { CollisionEvent } from "../../engine/physics/Events";
import PlaneInput from "./PlaneInput";
import { planeImages } from "./Constants";
import InitSystem from "./InitSystem";
import RockSpawnerSystem from "./RockSpawnerSystem";
import RockSystem from "./RockSystem";

let game = new Game([]);

function gameInit() {

    let world = new World();
    game.addWorld(world);

    world.addSystemBundle(new RendererBundle());
    world.addSystemBundle(new InputBundle());
    world.addSystemBundle(new PhysicsBundle());
    world.addSystemBundle(new AnimationBundle());

    world.addEntity().addComponent(CanvasComponent, 800, 480);

    world.addSingletonComponent(CollisionMatrix, 3);
    const matrix = world.getSingletonComponent(CollisionMatrix) as CollisionMatrix;
    matrix.setCollision(0, 1, true);
    matrix.setCollision(0, 2, true);

    world.addReactiveSystem(InitSystem);
    world.addReactiveSystem(PlaneInput);
    world.addExecuteSystem(RockSpawnerSystem);
    world.addExecuteSystem(RockSystem);

    world.addReactiveSystem(class extends ReactiveSystem {
        private fired = false;

        onComponentAdded(e: Entity, c: Component) {
            if (!this.fired) {
                this.fired = true;
                game.stop();
                game.removeWorld(world);
                console.log("restart");
                gameInit();
            }
        }

        getComponentsToReact() {
            return [CollisionEvent]
        }

    })

    world.addExecuteSystem(GroundSpawnerSystem);

    world.addEntity().addComponent(ImageLoadRequest,
        ["starGold.png", "background.png", "groundGrass.png", "rock.png"].concat(planeImages), "assets/");

    game.start();
}

gameInit();