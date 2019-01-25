
import Vector2 from "./Vector2";

export type EdgeTuple = [number, number, number, number];

export default class Edge
{
    from: Vector2;
    to: Vector2;

    constructor(from: Vector2, to: Vector2)
    {
        this.from = from;
        this.to = to;
    }

    get length(): number
    {
        return this.from.getDistanceTo(this.to);
    }

    get center(): Vector2
    {
        return this.from.copy().add(this.to).divide({x: 2, y: 2});
    }

    get normal(): Vector2
    {
        return this.to.copy().subtract(this.from).perp().normalize();
    }

    intersectEdge(edge: Edge, ray: boolean = false): Vector2|null
    {
        const dx1 = this.to.x - this.from.x,
            dy1 = this.to.y - this.from.y,
            dx2 = this.from.x - edge.from.x,
            dy2 = this.from.y - edge.from.y,
            dx3 = edge.to.x - edge.from.x,
            dy3 = edge.to.y - edge.from.y;

        if (dy1 / dx1 === dy3 / dx3) {
            return null;
        }
        const d = dx1 * dy3 - dy1 * dx3;
        if (d === 0) {
            return null;
        }
        const r = (dy2 * dx3 - dx2 * dy3) / d;
        const s = (dy2 * dx1 - dx2 * dy1) / d;
        if ((r >= 0 && (ray || r <= 1)) && s >= 0 && s <= 1) {
            return new Vector2(this.from.x + r * dx1, this.from.y + r * dy1);
        }
        return null;
    }

    toTuple(): EdgeTuple
    {
        return this.from.toTuple().concat(this.to.toTuple()) as EdgeTuple;
    }

    static fromTuple(tuple: EdgeTuple): Edge
    {
        let [ax, ay, bx, by] = tuple;
        return new Edge(new Vector2(ax, ay), new Vector2(bx, by));
    }
}