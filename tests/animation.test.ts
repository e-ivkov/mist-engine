import World from "../engine/ecs-core/World"
import AnimationComponent from "../engine/animation/AnimationComponent";
import AnimationSystem from "../engine/animation/AnimationSystem";
import ImageComponent from "../engine/canvas-renderer/ImageComponent";


let world: World;
const frames = ["frame1", "frame2", "frame3"];

beforeEach(() => {
    world = new World();
});

test("animation playing", () => {
    const entity = world.addEntity().addComponent(AnimationComponent, frames, 2);
    world.addExecuteSystem(AnimationSystem);
    world.update(1);
    const img = entity.getComponent(ImageComponent) as ImageComponent;
    expect(img.fileName).toBe("frame1");
    world.update(1);
    expect(img.fileName).toBe("frame2");
    world.update(2);
    world.update(2);
    expect(img.fileName).toBe("frame1");
});

test("animation pause", () => {
    const entity = world.addEntity().addComponent(AnimationComponent, frames, 2, false);
    world.addExecuteSystem(AnimationSystem);
    world.update(3);
    const img = entity.getComponent(ImageComponent) as ImageComponent;
    expect(img.fileName).toBe("frame1");
});