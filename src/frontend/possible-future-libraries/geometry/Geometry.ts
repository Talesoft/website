
import Vector2 from "./Vector2";
import Edge from "./Edge";
import Rectangle from "./Rectangle";
import Circle from "./Circle";
import Polygon from "./Polygon";

export function extractX(item: ({x: number})): number
{
    return item.x;
}

export function extractY(item: ({y: number})): number
{
    return item.y;
}

export interface Geometry
{
    contains(vec2: Vector2): boolean;
    overlapsEdge(edge: Edge): boolean;
    intersectEdge(edge: Edge): Vector2[];
    overlapsRectangle(rect: Rectangle): boolean;
    intersectRectangle(rect: Rectangle): Vector2[];
    overlapsCircle(circle: Circle): boolean;
    intersectCircle(circle: Circle): Vector2[];
    overlapsPolygon(poly: Polygon): boolean;
    intersectPolygon(poly: Polygon): Vector2[];
}