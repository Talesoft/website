
import Vector2, {Vector2Literal} from "./Vector2";
import Rectangle from "./Rectangle";
import {clamp} from "./Math";
import {Geometry} from "./Geometry";
import Edge from "./Edge";
import Polygon from "./Polygon";

const {PI, sqrt} = Math;

export interface CircleLiteral
{
    x: number;
    y: number;
    radius: number;
}

export type CircleTuple = [number, number, number];

export default class Circle implements Geometry, CircleLiteral
{
    x: number = 0;
    y: number = 0;
    radius: number = 0;

    constructor(x?: number, y?: number, radius?: number)
    {
        if (typeof x !== 'undefined') {
            this.x = x;
        }

        if (typeof y !== 'undefined') {
            this.y = y;
        }

        if (typeof radius !== 'undefined') {
            this.radius = radius;
        }
    }

    get area(): number
    {
        return this.radius * this.radius * PI;
    }

    get position(): Vector2
    {
        return new Vector2(this.x, this.y);
    }

    set position(vec2: Vector2)
    {
        this.x = vec2.x;
        this.y = vec2.y;
    }

    set(rect: Partial<CircleLiteral>): Circle
    {
        if (typeof rect.x !== 'undefined') {
            this.x = rect.x;
        }

        if (typeof rect.y !== 'undefined') {
            this.y = rect.y;
        }

        if (typeof rect.radius !== 'undefined') {
            this.radius = rect.radius;
        }
        return this;
    }

    add(rect: Partial<CircleLiteral>): Circle
    {
        if (typeof rect.x !== 'undefined') {
            this.x += rect.x;
        }

        if (typeof rect.y !== 'undefined') {
            this.y += rect.y;
        }

        if (typeof rect.radius !== 'undefined') {
            this.radius += rect.radius;
        }
        return this;
    }

    subtract(rect: Partial<CircleLiteral>): Circle
    {
        if (typeof rect.x !== 'undefined') {
            this.x -= rect.x;
        }

        if (typeof rect.y !== 'undefined') {
            this.y -= rect.y;
        }

        if (typeof rect.radius !== 'undefined') {
            this.radius -= rect.radius;
        }
        return this;
    }

    multiply(rect: Partial<CircleLiteral>): Circle
    {
        if (typeof rect.x !== 'undefined') {
            this.x *= rect.x;
        }

        if (typeof rect.y !== 'undefined') {
            this.y *= rect.y;
        }

        if (typeof rect.radius !== 'undefined') {
            this.radius *= rect.radius;
        }
        return this;
    }

    divide(rect: Partial<CircleLiteral>): Circle
    {
        if (typeof rect.x !== 'undefined') {
            this.x /= rect.x;
        }

        if (typeof rect.y !== 'undefined') {
            this.y /= rect.y;
        }

        if (typeof rect.radius !== 'undefined') {
            this.radius /= rect.radius;
        }
        return this;
    }

    copy(): Circle
    {
        return new Circle(this.x, this.y, this.radius);
    }

    contains(vec2: Vector2Literal): boolean
    {
        return sqrt((vec2.x - this.x) * (vec2.x - this.x) + (vec2.y - this.y) * (vec2.y - this.y)) < this.radius;
    }

    //@ts-ignore
    overlapsEdge(edge: Edge): boolean
    {
        throw new Error('Not implemented');
    }

    //@ts-ignore
    intersectEdge(edge: Edge): Vector2[]
    {
        throw new Error('Not implemented');
    }

    overlapsRectangle(rect: Rectangle): boolean
    {
        let v = new Vector2(clamp(rect.left, this.x, rect.right), clamp(rect.top, this.y, rect.bottom));
        let direction = this.position.subtract(v);
        let mag = direction.magnitude;
        return ((mag > 0) && (mag < this.radius * this.radius));
    }

    //@ts-ignore
    intersectRectangle(rect: Rectangle): Vector2[]
    {
        throw new Error('Not implemented');
    }

    overlapsCircle(circle: Circle): boolean
    {
        let distanceX = this.x - circle.x;
        let distanceY = this.y - circle.y;
        let radiusSum = this.radius + circle.radius;
        return distanceX * distanceX + distanceY * distanceY <= radiusSum * radiusSum;
    }

    //@ts-ignore
    intersectCircle(circle: Circle): Vector2[]
    {
        throw new Error('Not implemented');
    }

    //@ts-ignore
    overlapsPolygon(poly: Polygon): boolean
    {
        throw new Error('Not implemented');
    }

    //@ts-ignore
    intersectPolygon(poly: Polygon): Vector2[]
    {
        throw new Error('Not implemented');
    }

    toTuple(): CircleTuple
    {
        return [this.x, this.y, this.radius];
    }

    toString(): string
    {
        return `circle(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.radius.toFixed(2)})`
    }

    static fromTuple(tuple: CircleTuple): Circle
    {
        return new Circle(...tuple);
    }
}