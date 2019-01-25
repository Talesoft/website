
import React, {ReactNode, RefObject, useEffect, useState} from "react";
import {Vector2Literal} from "../../geometry/Vector2";

export type CanvasPointerInputRenderFunction = (pointer: CanvasPointerInputState) => ReactNode;

export interface CanvasPointerInputProps
{
    canvasRef: RefObject<HTMLCanvasElement>;
    render?: CanvasPointerInputRenderFunction;
    children?: CanvasPointerInputRenderFunction;
}

export interface CanvasPointerInputState
{
    position: Vector2Literal;
}

export function usePointer<T extends HTMLElement>(element: T|null): CanvasPointerInputState
{
    const [position, setPosition] = useState<Vector2Literal>({x: -1, y: -1});

    function onPointerMove(event: PointerEvent)
    {
        const {clientX, clientY, currentTarget} = event;
        const rect = (currentTarget as T).getBoundingClientRect();
        setPosition({
            x: clientX - rect.left,
            y: clientY - rect.top
        });
    }

    useEffect(() =>
    {
        if (!element) {
            return;
        }
        element.addEventListener('pointermove', onPointerMove);
        return () => element.removeEventListener('pointermove', onPointerMove);
    }, [element]);

    return {position};
}

export default function CanvasPointerInput({canvasRef, render, children}: CanvasPointerInputProps)
{
    const pointer = usePointer(canvasRef.current);
    const renderChildren = render || children;
    return <>
        {renderChildren && renderChildren(pointer)}
    </>;
}