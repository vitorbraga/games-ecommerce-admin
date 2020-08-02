
type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.json' {
    const content: any;
    export default content;
}

declare module '*.scss' {
    const content: { [Key: string]: string };
    export = content;
}

declare module '*.gif' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg';
