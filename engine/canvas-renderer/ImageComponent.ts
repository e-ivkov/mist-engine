import Component from "../ecs-core/Component";

export default class ImageComponent extends Component {
    fileName: string;

    constructor(fileName: string) {
        super();
        this.fileName = fileName;
    }
}