
export function classes(...classes: any): string|undefined
{
    return classes.filter((c: any) => typeof c === 'string' && c !== '').join(' ') || undefined;
}

export function boolString(value: boolean): 'true'|'false'
{
    return value ? 'true' : 'false';
}

export function getHashCode(value: string) {
    const len = value.length;
    let hash = 0;
    if (len === 0) {
        return hash;
    }
    let charCode;
    for (let i = 0; i < len; i++) {
        charCode = value.charCodeAt(i);
        hash = ((hash << 5) - hash) + charCode;
        hash |= 0;
    }
    return hash;
}