import Component from "../ecs-core/Component";

export default class ImageLoadRequest extends Component {
    assetFolder: string = "";
    fileNames: string[];

    constructor(fileNames: string[], assetFolder?: string) {
        super();
        if (assetFolder) this.assetFolder = assetFolder;
        this.fileNames = Array.from(fileNames);
    }
}