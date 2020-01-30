import World from "../engine/ecs-core/World";
import getInputBundle from "../engine/input-management/InputBundle";
import Game from "../engine/Game";
import { ClickEvent, KeyDownEvent } from "../engine/input-management/EventComponents";

let world: World;

beforeEach(() => {
    world = new World();
    world.addSystemBundle(getInputBundle());
    const game = new Game([world]);
    game.start();
});

test("on click", () => {
    document.dispatchEvent(new Event("click"));
    expect(world.entitiesWithComponents([ClickEvent])).toHaveLength(1);
});

test("on key down", () => {
    const keys = ["a", " ", "1"];
    keys.forEach(k => document.dispatchEvent(new KeyboardEvent("keydown", { key: k })));
    expect(world.entitiesWithComponents([KeyDownEvent])).toHaveLength(3);
    const recievedKeys = world.entitiesWithComponents([KeyDownEvent])
        .map(e => (e.getComponent(KeyDownEvent)! as KeyDownEvent).event.key)
    expect(recievedKeys.sort()).toEqual(keys.sort());
})