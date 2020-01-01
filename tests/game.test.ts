import Scene from "../engine/Scene";
import Game from "../engine/Game";

test("main game loop", () => {
    window.requestAnimationFrame = jest.fn();
    window.performance.now = jest.fn().mockReturnValueOnce(0)
        .mockReturnValueOnce(-1);
    const scene = new Scene();
    scene.update = jest.fn();
    const game = new Game(scene);
    game.start();
    expect(window.requestAnimationFrame).toBeCalledTimes(1);
    expect(scene.update).toBeCalledTimes(1);
    expect(scene.update).lastCalledWith(-1);
});