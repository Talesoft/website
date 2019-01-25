
import Vector2 from "./Vector2";
import Rectangle from "./Rectangle";
import Edge from "./Edge";

export type PolygonTuple = [number, number][];

const centerSymbol: unique symbol = Symbol('center');
const boundsSymbol: unique symbol = Symbol('bounds');
const edgesSymbol: unique symbol = Symbol('edges');
const edgeNormalsSymbol: unique symbol = Symbol('edgeNormals');
const edgeCentersSymbol: unique symbol = Symbol('edgeCenters');

const {min, max} = Math;

function createInvalidateHandler<T extends Vector2[]|Vector2>(poly: Polygon, deep: boolean = true): ProxyHandler<T>
{
    return {
        set: (target, p, value) =>
        {
            if (deep && value instanceof Vector2) {
                value = new Proxy(value, createInvalidateHandler(poly, false));
            }
            // @ts-ignore
            target[p] = value;
            poly[centerSymbol]
                = poly[boundsSymbol]
                = poly[edgesSymbol]
                = poly[edgeNormalsSymbol]
                = poly[edgeCentersSymbol]
                = null;
            return true;
        }
    };
}

export default class Polygon
{
    readonly vertices: Vector2[] = new Proxy([], createInvalidateHandler(this));
    [centerSymbol]: Vector2|null = null;
    [boundsSymbol]: Rectangle|null = null;
    [edgesSymbol]: Edge[]|null = null;
    [edgeNormalsSymbol]: Vector2[]|null = null;
    [edgeCentersSymbol]: Vector2[]|null = null;

    constructor(points: Vector2[] = [])
    {
        for (let i = 0, len = points.length; i < len; i++) {
            this.vertices.push(points[i]);
        }
    }

    get center(): Readonly<Vector2>
    {
        if (this[centerSymbol] !== null) {
            return this[centerSymbol] as Vector2;
        }
        let len = this.vertices.length;
        return this[centerSymbol] = this.vertices
            .reduce((carry: Vector2, vec2: Vector2) => carry.add(vec2), new Vector2)
            .divide({x: len, y: len});
    }

    get bounds(): Readonly<Rectangle>
    {
        if (this[boundsSymbol] !== null) {
            return this[boundsSymbol] as Rectangle;
        }
        let len = this.vertices.length;
        if (len === 0) {
            return this[boundsSymbol] = new Rectangle;
        }
        let minX, minY, maxX, maxY;
        for (let i = 0; i < len; i++) {
            let vec2 = this.vertices[i];
            minX = typeof minX === 'undefined' ? vec2.x : min(minX, vec2.x);
            minY = typeof minY === 'undefined' ? vec2.y : min(minY, vec2.y);
            maxX = typeof maxX === 'undefined' ? vec2.x : max(maxX, vec2.x);
            maxY = typeof maxY === 'undefined' ? vec2.y : max(maxY, vec2.y);
        }
        return this[boundsSymbol] = new Rectangle(
            minX,
            minY,
            (maxX as number) - (minX as number),
            (maxY as number) - (minY as number)
        );
    }

    get edges(): Readonly<Readonly<Edge>[]>
    {
        if (this[edgesSymbol] !== null) {
            return this[edgesSymbol] as Edge[];
        }
        let vertices = this.vertices;
        let len = vertices.length;
        if (len < 2) {
            return [];
        }
        let edges = [];
        let last = vertices[len - 1];
        for (let i = 0; i < len; i++) {
            let vec2 = vertices[i];
            edges.push(new Edge(last, vec2));
            last = vec2;
        }
        return this[edgesSymbol] = edges;
    }

    get edgeNormals(): Readonly<Readonly<Vector2>[]>
    {
        if (this[edgeNormalsSymbol] !== null) {
            return this[edgeNormalsSymbol] as Vector2[];
        }
        return this[edgeNormalsSymbol] = this.edges.map(edge => edge.normal);
    }

    get edgeCenters(): Readonly<Readonly<Vector2>[]>
    {
        if (this[edgeCentersSymbol] !== null) {
            return this[edgeCentersSymbol] as Vector2[];
        }
        return this[edgeCentersSymbol] = this.edges.map(edge => edge.center);
    }

    get x(): number
    {
        return this.bounds.x;
    }

    set x(value: number)
    {
        let diff = value - this.x;
        for (let i = 0, len = this.vertices.length; i < len; i++) {
            this.vertices[i].x += diff;
        }
    }

    get y(): number
    {
        return this.bounds.y;
    }

    set y(value: number)
    {
        let diff = value - this.y;
        for (let i = 0, len = this.vertices.length; i < len; i++) {
            this.vertices[i].y += diff;
        }
    }

    get width(): number
    {
        return this.bounds.width;
    }

    set width(value: number)
    {
        let ratio = value / this.width,
            x = this.x;
        for (let i = 0, len = this.vertices.length; i < len; i++) {
            this.vertices[i].x = x + (this.vertices[i].x - x) * ratio;
        }
    }

    get height(): number
    {
        return this.bounds.height;
    }

    set height(value: number)
    {
        let ratio = value / this.height,
            y = this.y;
        for (let i = 0, len = this.vertices.length; i < len; i++) {
            this.vertices[i].y = y + (this.vertices[i].y - y) * ratio;
        }
    }

    contains(vec2: Vector2): boolean
    {
        const bounds = this.bounds;
        if (!bounds.contains(vec2)) {
            return false;
        }

        const ray = new Edge(vec2, bounds.leftTop.subtract({x: 1, y: 1}));
        let intersections = 0;
        const edges = this.edges;
        for (let i = 0, len = edges.length; i < len; i++) {
            const edge = edges[i];
            if (ray.intersectEdge(edge, true) !== null) {
                intersections++;
            }
        }
        return intersections % 2 !== 0;
    }

    //TODO: overlapsEdge(edge: Edge): boolean
    //TODO: intersectEdge(edge: Edge): Vector2
    //TODO: overlapsRectangle(rect: Rectangle): boolean
    //TODO: intersectRectnalge(rect: Rectangle): Vector2
    //TODO: overlapsCircle(circle: Circle): boolean
    //TODO: intersectCircle(circle: Circle): Vector2

    overlapsPolygon(poly: Polygon): boolean
    {
        const edges = this.edges;
        const len = edges.length;
        const polyEdges = poly.edges;
        const polyEdgesLen = polyEdges.length;
        for (let i = 0; i < len; i++) {
            const edge = edges[i];
            for (let j = 0; j < polyEdgesLen; j++) {
                if (edge.intersectEdge(polyEdges[j])) {
                    return true;
                }
            }
        }
        return false;
    }

    intersectPolygon(poly: Polygon): Vector2[]
    {
        let intersections: Vector2[] = [];
        let edges = this.edges;
        let polyEdges = poly.edges;
        let polyEdgesLen = polyEdges.length;
        let intersection;
        for (let i = 0, len = edges.length; i < len; i++) {
            let edge = edges[i];
            for (let j = 0; j < polyEdgesLen; j++) {
                if ((intersection = edge.intersectEdge(polyEdges[j])) !== null) {
                    intersections.push(intersection);
                }
            }
        }
        return intersections;
    }

    toTuple(): PolygonTuple
    {
        return this.vertices.map(vec2 => vec2.toTuple());
    }

    toString(): string
    {
        return `poly(${this.vertices.map(vec2 => vec2.toString()).join(', ')}`;
    }

    static fromTuple(tuple: PolygonTuple): Polygon
    {
        return new Polygon(tuple.map(([x, y]) => new Vector2(x, y)));
    }
}