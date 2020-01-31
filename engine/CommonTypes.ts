/**
 * vector adopts coordinate system starting from left-top corner.
 * X increases to the right
 * Y increases to the bottom
 */
export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static get zero() {
        return new Vector2(0, 0);
    }

    static get up() {
        return new Vector2(0, -1);
    }

    static get right() {
        return new Vector2(1, 0);
    }

    static get down() {
        return this.up.opposite;
    }

    static get left() {
        return this.right.opposite;
    }

    get opposite() {
        return this.mul(-1);
    }

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    get normalized() {
        return new Vector2(this.x / this.length, this.y / this.length);
    }

    equals(other: Vector2) {
        return this.x === other.x && this.y === other.y;
    }

    add(other: Vector2) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    mul(k: number) {
        return new Vector2(this.x * k, this.y * k);
    }

    dot(other: Vector2) {
        return this.x * other.x + this.y * other.y;
    }

    angle(other: Vector2) {
        return Math.acos(this.dot(other) / (this.length * other.length));
    }

    rotate(angle: number) {
        const x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
        const y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
        return new Vector2(x, y);
    }
}