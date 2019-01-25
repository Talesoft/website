
const {min, max, PI} = Math;

export const epsilon = 0.00001;
export const epsilonNormalSqrt = 1e-15;
export const rad = PI / 180;
export const deg = 180 / PI;

export function degToRad(degrees: number): number
{
    return degrees * rad;
}

export function radToDeg(radians: number): number
{
    return radians * deg;
}

export function clamp(minValue: number, value: number, maxValue: number): number
{
    return max(minValue, min(value, maxValue));
}

export function clamp01(value: number): number
{
    return clamp(0, value, 1);
}