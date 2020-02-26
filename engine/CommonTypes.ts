/**
 * Vector adopts coordinate system with origin point in center
 * Positive X axis direction to the right
 * Positive Y axis direction upwards
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
        return new Vector2(0, 1);
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

    clone() {
        return new Vector2(this.x, this.y);
    }
}

export class MatrixCreationError extends Error { }
export class MatrixInvalidIndexError extends Error { }

/**
 * Custom Matrix2D class used mainly to not depend on DOM in test and unrelated to rendering systems. Also DOMMatrix is unstable.
 * Represents a 3x3 matrix for 2d transformations, uses @class Vector2
 * Indexes are the following: i - row, j - column, starting from 0 to 2 inclusive.
 */
export class Matrix2D {

    private cells: Float64Array;

    constructor(cells?: Float64Array) {
        if (cells) {
            if (cells.length != 9)
                throw new MatrixCreationError("2D matrix should have 9 cells, given: " + cells.length + " cells");
            this.cells = cells;
        } else {
            this.cells = Float64Array.of(
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            );
        }
    }

    get raw() {
        return Float64Array.from(this.cells);
    }

    checkIndex(i: number) {
        if (i >= 3) throw new MatrixInvalidIndexError("Index should be less than 3, got: " + i)
    }

    getCell(i: number, j: number) {
        this.checkIndex(i);
        this.checkIndex(j);
        return this.cells[i * 3 + j];
    }

    setCell(i: number, j: number, value: number) {
        this.checkIndex(i);
        this.checkIndex(j);
        this.cells[i * 3 + j] = value;
    }

    multiply(other: Matrix2D) {
        let dest = new Float64Array(9);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let sum = 0;

                for (let k = 0; k < 3; k++) {
                    sum += this.cells[i * 3 + k] * other.cells[k * 3 + j];
                }

                dest[i * 3 + j] = sum;
            }
        }

        return new Matrix2D(dest);
    }

    translate(tx = 0, ty = 0) {
        let translation = new Matrix2D(Float64Array.of(
            1, 0, tx,
            0, 1, ty,
            0, 0, 1,
        ));

        return this.multiply(translation);
    }

    scale(sx = 1, sy = 1) {
        let scaleM = new Matrix2D(Float64Array.of(
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ));

        return this.multiply(scaleM);
    }

    rotate(r = 0) {

        let c = Math.cos(r);
        let s = Math.sin(r);

        let rotation = new Matrix2D(Float64Array.of(
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        ));

        return this.multiply(rotation);
    }

    transformPoint(p: Vector2) {
        let pointM = new Matrix2D(Float64Array.of(
            p.x, 0, 0,
            p.y, 0, 0,
            1, 0, 0,
        ));

        let transformed = this.multiply(pointM);
        return new Vector2(transformed.getCell(0, 0), transformed.getCell(1, 0));
    }


    /**
     * @returns 2d DOMMatrix (which is unstable) in the form of
     *  a, c, e,
     *  b, d, f,
     *  0, 0, 1,
     */
    toDOMMatrix() {
        let matrix = new DOMMatrix();

        matrix.a = this.getCell(0, 0);
        matrix.b = this.getCell(1, 0);

        matrix.c = this.getCell(0, 1);
        matrix.d = this.getCell(1, 1);

        matrix.e = this.getCell(0, 2);
        matrix.f = this.getCell(1, 2);

        return matrix;
    }
}