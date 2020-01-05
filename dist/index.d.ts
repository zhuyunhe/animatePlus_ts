interface AnimateObject {
    elements: any;
    element: any;
    keyframes: object[];
    loop: boolean;
    optimize: any;
    direction: any;
    change: any;
    easing: any;
    duration: number;
    gaussian: any;
    end: any;
    options: any;
    elapsed: number;
    startTime: number;
    blur: object | null;
}
declare const _default: (options: AnimateObject) => Promise<unknown>;
export default _default;
export declare const delay: (duration: number) => Promise<unknown>;
