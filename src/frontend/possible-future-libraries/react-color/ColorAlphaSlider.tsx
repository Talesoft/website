
import React, {Component, PointerEvent} from "react";
import Color from "../color/Color";

export interface ColorAlphaSliderProps
{
    color: string;
    width: number;
    height: number;
    className?: string;
    onChange?: (color: string) => void;
    thumbWidth?: number;
}

export default class ColorAlphaSlider extends Component<ColorAlphaSliderProps>
{
    private static lastUniqueId = 0;
    private readonly uniqueId: number;
    private down = false;

    get width(): number
    {
        return this.props.width;
    }

    get height(): number
    {
        return this.props.height;
    }

    get thumbWidth(): number
    {
        return this.props.thumbWidth || 20;
    }

    get trackX(): number
    {
        return this.thumbWidth / 2;
    }

    get trackY(): number
    {
        return 10;
    }

    get trackWidth(): number
    {
        return this.width - this.thumbWidth;
    }

    get trackHeight(): number
    {
        return this.height - 20;
    }

    constructor(props: ColorAlphaSliderProps)
    {
        super(props);
        this.uniqueId = ColorAlphaSlider.lastUniqueId++;
        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
    }

    componentDidMount(): void
    {
        document.body.addEventListener('pointerup', this.onPointerUp);
    }

    componentWillUnmount(): void
    {
        document.body.removeEventListener('pointerup', this.onPointerUp);
    }

    onPointerDown(event: PointerEvent<SVGSVGElement>)
    {
        this.down = true;
        this.changeByPointerEvent(event);
    }

    onPointerUp()
    {
        this.down = false;
    }

    onPointerMove(event: PointerEvent<SVGSVGElement>)
    {
        if (!this.down) {
            return;
        }
        this.changeByPointerEvent(event);
    }

    private changeByPointerEvent(event: PointerEvent<SVGSVGElement>)
    {
        const {color, onChange} = this.props;
        const {clientX, currentTarget} = event;
        const rect = (currentTarget as SVGSVGElement).getBoundingClientRect();
        const x = clientX - (rect.left - this.trackX);
        const alpha = x / this.trackWidth;
        const colorInstance = Color.fromString(color);
        colorInstance.alpha = alpha;
        if (onChange) {
            console.log(colorInstance.toString());
            onChange(colorInstance.toString());
        }
    }

    render()
    {
        const {color, className} = this.props;
        let {width, height} = this.props;
        width = typeof width === 'string' ? parseInt(width) : width;
        height = typeof height === 'string' ? parseInt(height) : height;
        const patternUniqueId = `ColorAlphaSlider__background-pattern--${this.uniqueId}`;
        const gradientUniqueId = `ColorAlphaSlider__gradient--${this.uniqueId}`;
        const {trackX, trackY, trackWidth, trackHeight} = this;
        const colorInstance = Color.fromString(color);
        const rgbString = colorInstance.rgbString;
        return <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${width} ${height}`}
            onPointerDown={this.onPointerDown}
            onPointerMove={this.onPointerMove}>
            <defs>
                <pattern id={patternUniqueId} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="5" height="5" fill="#ccc" />
                    <rect x="5" y="5" width="5" height="5" fill="#ccc" />
                </pattern>
                <linearGradient id={gradientUniqueId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={rgbString} stopOpacity="0" />
                    <stop offset="100%" stopColor={rgbString} stopOpacity="1" />
                </linearGradient>
            </defs>
            <g className="ColorAlphaSlider__track">
                <rect x={trackX} y={trackY} width={trackWidth} height={trackHeight} fill={`url(#${patternUniqueId})`} />
                <rect x={trackX} y={trackY} width={trackWidth} height={trackHeight} fill={`url(#${gradientUniqueId}`} />
            </g>
        </svg>;
    }
}