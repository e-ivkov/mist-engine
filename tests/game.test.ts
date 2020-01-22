import World from "../engine/ecs-core/World";
import Game from "../engine/Game";

test("main game loop", () => {
    window.requestAnimationFrame = jest.fn();
    window.performance.now = jest.fn().mockReturnValueOnce(0)
        .mockReturnValueOnce(-1);
    const world = new World();
    world.update = jest.fn();
    const game = new Game(world);
    game.start();
    expect(window.requestAnimationFrame).toBeCalledTimes(1);
    expect(world.update).toBeCalledTimes(1);
    expect(world.update).lastCalledWith(-1);
});