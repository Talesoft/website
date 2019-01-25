
import React, {Component} from "react";

export interface ColorImageProps
{
    color: string;
    width: number|string;
    height: number|string;
    className?: string;
}

export default class ColorImage extends Component<ColorImageProps>
{
    private static lastUniqueId = 0;
    private readonly uniqueId: number;

    constructor(props: ColorImageProps)
    {
        super(props);
        this.uniqueId = ColorImage.lastUniqueId++;
    }

    render()
    {
        const {color, width, height, className} = this.props;
        const patternUniqueId = `ColorImage__background-pattern--${this.uniqueId}`;
        return <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`}>
            <defs>
                <pattern id={patternUniqueId} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="5" height="5" fill="#ccc" />
                    <rect x="5" y="5" width="5" height="5" fill="#ccc" />
                </pattern>
            </defs>
            <rect x="0" y="0" width={width} height={height} fill={`url(#${patternUniqueId})`} />
            <rect x={0} y={0} width={width} height={height} fill={color} />
        </svg>;
    }
}