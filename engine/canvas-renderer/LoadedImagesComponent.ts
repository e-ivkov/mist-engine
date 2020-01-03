import Component from "../ecs-core/Component";

export default class LoadedImagesComponent extends Component {
    imagesByFilename: Map<string, HTMLImageElement> = new Map();
}