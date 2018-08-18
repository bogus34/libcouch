import { DbErrorInterface } from "./interfaces";
export declare class DbError extends Error implements DbErrorInterface {
    status: number;
    constructor(srcError: any);
    isConflict(): boolean;
}
