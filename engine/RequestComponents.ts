import Component from "./ecs-core/Component";
import Scene from "./ecs-core/Scene";

export class RequestSwitchScene extends Component {
    nextScene: Scene;

    constructor(nextScene: Scene) {
        super();
        this.nextScene = nextScene;
    }
}