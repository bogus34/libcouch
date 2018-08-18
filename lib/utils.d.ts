declare type VoidFunc = (...args: any[]) => void;
export declare function stdCallback(resolve: VoidFunc, reject: VoidFunc): (err: any, data: any) => void;
export declare function isNil(v: any): boolean;
export {};
