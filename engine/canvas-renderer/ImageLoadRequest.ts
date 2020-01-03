import Component from "../ecs-core/Component";

export default class ImageLoadRequest extends Component {
    assetFolder: string = "";
    fileNames: string[] = new Array();
}