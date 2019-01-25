
import {clamp, clamp01, epsilon} from "./Math";

const {sqrt, acos, min, max} = Math;

export interface Vector2Literal
{
    x: number;
    y: number;
}

export type Vector2Tuple = [number, number];

export default class Vector2 implements Vector2Literal
{
    static readonly zero: Readonly<Vector2> = new Vector2(0, 0);
    static readonly one: Readonly<Vector2> = new Vector2(1, 1);
    static readonly up: Readonly<Vector2> = new Vector2(0, 1);
    static readonly down: Readonly<Vector2> = new Vector2(0, -1);
    static readonly left: Readonly<Vector2> = new Vector2(-1, 0);
    static readonly right: Readonly<Vector2> = new Vector2(1, 0);
    static readonly infinity: Readonly<Vector2> = new Vector2(Infinity, Infinity);
    static readonly negativeInfinity: Readonly<Vector2> = new Vector2(-Infinity, -Infinity);

    x: number = 0;
    y: number = 0;

    constructor(x?: number, y?: number)
    {
        if (typeof x !== 'undefined') {
            this.x = x;
        }

        if (typeof y !== 'undefined') {
            this.y = y;
        }
    }

    get length(): number
    {
        return this.x * this.x + this.y * this.y;
    }

    get magnitude(): number
    {
        return sqrt(this.length);
    }

    set(vec2: Partial<Vector2Literal>): Vector2
    {
        if (typeof vec2.x !== 'undefined') {
            this.x = vec2.x;
        }

        if (typeof vec2.y !== 'undefined') {
            this.y = vec2.y;
        }
        return this;
    }

    add(vec2: Partial<Vector2Literal>): Vector2
    {
        if (typeof vec2.x !== 'undefined') {
            this.x += vec2.x;
        }

        if (typeof vec2.y !== 'undefined') {
            this.y += vec2.y;
        }
        return this;
    }

    subtract(vec2: Partial<Vector2Literal>): Vector2
    {
        if (typeof vec2.x !== 'undefined') {
            this.x -= vec2.x;
        }

        if (typeof vec2.y !== 'undefined') {
            this.y -= vec2.y;
        }
        return this;
    }

    multiply(vec2: Partial<Vector2Literal>): Vector2
    {
        if (typeof vec2.x !== 'undefined') {
            this.x *= vec2.x;
        }

        if (typeof vec2.y !== 'undefined') {
            this.y *= vec2.y;
        }
        return this;
    }

    divide(vec2: Partial<Vector2Literal>): Vector2
    {
        if (typeof vec2.x !== 'undefined') {
            this.x /= vec2.x;
        }

        if (typeof vec2.y !== 'undefined') {
            this.y /= vec2.y;
        }
        return this;
    }

    negate(): Vector2
    {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    min(vec2: Vector2Literal): Vector2
    {
        if (typeof vec2.x !== 'undefined') {
            this.x = min(this.x, vec2.x);
        }

        if (typeof vec2.y !== 'undefined') {
            this.y = min(this.y, vec2.y);
        }
        return this;
    }

    max(vec2: Vector2Literal): Vector2
    {
        if (typeof vec2.x !== 'undefined') {
            this.x = max(this.x, vec2.x);
        }

        if (typeof vec2.y !== 'undefined') {
            this.y = max(this.y, vec2.y);
        }
        return this;
    }

    clamp(minValue: number, maxValue: number): Vector2
    {
        this.x = clamp(minValue, this.x, maxValue);
        this.y = clamp(minValue, this.y, maxValue);
        return this;
    }

    clamp01(): Vector2
    {
        return this.clamp(0, 1);
    }

    normalize(): Vector2
    {
        let mag = this.magnitude;
        if (mag !== 0) {
            this.x /= mag;
            this.y /= mag;
        }
        return this;
    };

    lerp(vec2: Vector2Literal, t: number): Vector2
    {
        return this.lerpUnclamped(vec2, clamp01(t));
    }

    lerpUnclamped(vec2: Vector2Literal, t: number): Vector2
    {
        return this.add({
            x: (vec2.x - this.x) * t,
            y: (vec2.y - this.y) * t
        });
    }

    perp(): Vector2
    {
        const x = this.x;
        this.x = this.y;
        this.y = -x;
        return this;
    };

    moveTowards(vec2: Vector2, maxDistanceDelta: number): Vector2
    {
        let toVector = vec2.copy().subtract(this);
        let dist = toVector.magnitude;
        if (dist <= maxDistanceDelta || dist == 0) {
            return this;
        }
        let divisor = dist * maxDistanceDelta;
        this.add(toVector);
        this.x /= divisor;
        this.y /= divisor;
        return this;
    }

    moveBy(amount: number, direction: Vector2): Vector2
    {
        return this.add({
            x: direction.x * amount,
            y: direction.y * amount
        });
    }

    getDotProduct(vec2: Vector2Literal): number
    {
        return this.x * vec2.x + this.y * vec2.y;
    }

    getAngleTo(vec2: Vector2): number
    {
        let denominator = sqrt(this.length * vec2.length);
        if (denominator < epsilon) {
            return 0;
        }
        let dot = clamp(-1, this.getDotProduct(vec2) / denominator, 1);
        return acos(dot);
    }

    getDistanceTo(vec2: Vector2Literal): number
    {
        return this.copy().subtract(vec2).magnitude;
    }

    equals(vec2: Vector2Literal): boolean
    {
        return this.x === vec2.x && this.y === vec2.y;
    }

    isZero(): boolean
    {
        return this.x === 0 && this.y === 0;
    }

    isOne(): boolean
    {
        return this.x === 1 && this.y === 1;
    }

    copy(): Vector2
    {
        return new Vector2(this.x, this.y);
    }

    toTuple(): Vector2Tuple
    {
        return [this.x, this.y];
    }

    toString(): string
    {
        return `vec2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }

    static fromTuple(tuple: Vector2Tuple): Vector2
    {
        return new Vector2(...tuple);
    }
}