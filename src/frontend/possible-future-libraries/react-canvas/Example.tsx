
import Canvas from "./Canvas";
import React, {createRef, useState} from "react";
import CanvasRectangle from "./CanvasRectangle";
import CanvasPointerInput from "./input/CanvasPointerInput";

export default function Example()
{
    const canvasRef = createRef<HTMLCanvasElement>();
    //@ts-ignore
    const [width, setWidth] = useState(400);
    //@ts-ignore
    const [height, setHeight] = useState(300);

    return <Canvas width={width} height={height} canvasRef={canvasRef}>
        {context => <>
            <CanvasPointerInput canvasRef={canvasRef}>
                {({position: {x: pointerX, y: pointerY}}) => <>
                    <CanvasRectangle context={context} x={pointerX} y={pointerY} width={200} height={200} fill="red" />
                </>}
            </CanvasPointerInput>
        </>}
    </Canvas>
}