import Game from "../engine/Game";
import Scene from "../engine/ecs-core/Scene";
import { SceneStarted } from "../engine/EventComponents";

test("scene started system", () => {
    window.requestAnimationFrame = jest.fn();
    const scene = new Scene();
    const game = new Game(scene);
    game.start();
    expect(scene.entitiesWithComponents([SceneStarted])).toHaveLength(1);
    game["update"]();
    expect(scene.entitiesWithComponents([SceneStarted])).toHaveLength(0);
    expect(scene["alwaysAwakeSystems"].size).toBe(0);
})