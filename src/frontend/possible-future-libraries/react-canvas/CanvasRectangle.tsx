
import {useEffect} from "react";
import {RectangleLiteral} from "../geometry/Rectangle";
import {CanvasContext} from "./Canvas";

export interface CanvasRectProps extends RectangleLiteral
{
    context: CanvasContext;
    fill?: string;
    stroke?: string;
    clear?: boolean;
}

export default function CanvasRectangle({x = 0, y = 0, width = 0, height = 0, fill, stroke, clear, context}: CanvasRectProps)
{
    useEffect(() =>
    {
        if (clear) {
            console.log(`Clearing ${[x, y, width, height].join(', ')}`);
            context.clearRect(x, y, width, height);
        }

        if (fill) {
            console.log(`Filling ${[x, y, width, height].join(', ')} ${fill}`);
            if (context.fillStyle !== fill) {
                context.fillStyle = fill;
            }
            context.fillRect(x, y, width, height);
        }

        if (stroke) {
            console.log(`Stroking ${[x, y, width, height].join(', ')} ${stroke}`);
            if (context.strokeStyle !== stroke) {
                context.strokeStyle = stroke;
            }
            context.strokeRect(x, y, width, height);
        }
    }, [x, y, width, height, fill, stroke, clear]);
    return null;
}