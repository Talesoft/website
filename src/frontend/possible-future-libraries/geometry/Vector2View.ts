
import Vector2 from "./Vector2";

export default class Vector2View extends Vector2
{
    readonly data: Array<number>;
    readonly offset: number;

    constructor(data: Array<number>, offset: number = 0)
    {
        super();
        this.data = data;
        this.offset = offset;
    }

    get x(): number
    {
        return this.data[this.offset];
    }

    set x(value: number)
    {
        this.data[this.offset] = value;
    }

    get y(): number
    {
        return this.data[this.offset + 1];
    }

    set y(value: number)
    {
        this.data[this.offset + 1] = value;
    }
}