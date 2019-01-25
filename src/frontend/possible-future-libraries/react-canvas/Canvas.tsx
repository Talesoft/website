
import React, {createRef, ReactNode, RefObject, useEffect, useState} from "react";
import CanvasRectangle from "./CanvasRectangle";

export type CanvasContext = CanvasRenderingContext2D;

export interface CanvasProps
{
    width?: number;
    height?: number;
    className?: string;
    render?: (ctx: CanvasContext) => ReactNode;
    children?: (ctx: CanvasContext) => ReactNode;
    canvasRef?: RefObject<HTMLCanvasElement>;
}

export default function Canvas({width = 400, height = 200, className, render, children, canvasRef}: CanvasProps)
{
    const [context, setContext] = useState<CanvasContext|null>(null);
    const resolvedCanvasRef = canvasRef || createRef<HTMLCanvasElement>();

    //Passing empty children is completely valid for a lot of reasons
    if (!(typeof children === 'undefined' || children === null) && typeof children !== 'function') {
        throw Error('Canvas children have to be a single function accepting the canvas context');
    }

    useEffect(() =>
    {
        if (resolvedCanvasRef.current === null) {
            console.log('Deinitializing canvas');
            setContext(null);
            return;
        }

        const canvas = resolvedCanvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
            throw Error('Failed to initialize canvas context');
        }

        console.log('Initializing canvas');
        setContext(context);
    }, [resolvedCanvasRef.current]);

    const renderChildren = render || children;
    return <>
        <canvas width={width} height={height} className={className} ref={resolvedCanvasRef}>
            Your browser doesn't support canvas!
        </canvas>
        {context !== null && renderChildren && <>
            <CanvasRectangle context={context} x={0} y={0} width={width} height={height} clear />
            {renderChildren(context)}
        </>}
    </>;
}