import Component from "../ecs-core/Component";

type CanvasFillStyle = string | CanvasGradient | CanvasPattern;

/**
 * Text rendered by [[CanvasRendererSystem]] on the canvas element.
 * 
 * See [Drawing Text - Styling](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text)
 * for styling description.
 */
export default class CanvasText extends Component {
    text: string;

    /**
     * Same syntax as CSS font property string.
     */
    font: string;

    textAlign: CanvasTextAlign;

    textBaseline: CanvasTextBaseline;

    direction: CanvasDirection;

    fillStyle: CanvasFillStyle;

    maxWidth: number | undefined;

    constructor(text = "", font = "10px sans-serif", textAlign: CanvasTextAlign = "start", fillStyle: CanvasFillStyle = "black",
        textBaseline: CanvasTextBaseline = "alphabetic", direction: CanvasDirection = "inherit") {
        super();
        this.text = text;
        this.font = font;
        this.textAlign = textAlign;
        this.textBaseline = textBaseline;
        this.direction = direction;
        this.fillStyle = fillStyle;
    }
}