export interface NanoConfig {
    host?: string;
    port?: number;
    protocol?: string;
    username?: string;
    password?: string;
}
export declare type ID = string;
export interface Document {
    _id?: ID;
    _rev?: string;
    _deleted?: boolean;
    [key: string]: any;
}
export interface DBConnectorInterface {
    use(name: string): DBInterface;
}
export interface DBInterface {
    get(id: ID, params?: any): Promise<Document>;
    getOrNull(id: ID, params?: any): Promise<Document | null>;
    list(params?: any): Promise<any>;
    put(doc: Document): Promise<any>;
    remove(id: ID, rev: string): Promise<any>;
    view(design: string, view: string, params?: any): Promise<any>;
    bulk(docs: Document[], params?: any): Promise<any>;
}
export interface DbErrorInterface extends Error {
    status: number;
    name: string;
    stack?: any;
    isConflict(): boolean;
}
export declare type DateTime = string;
export declare type Timestamp = number;
export interface BaseDoc extends Document {
    $updated?: Timestamp;
    $created?: Timestamp;
    $type?: string;
}
export interface BaseModelInterface {
    id: string;
    instanceId: string | number;
    _rev?: string;
    $type: string;
    $created?: Timestamp;
    $updated?: Timestamp;
}
export interface MapperInterface<M extends BaseModelInterface, D extends BaseDoc> {
    prefix: string;
    type: string;
    loadJSON(model: M, data: D): void;
    dumpJSON(model: M): D;
}
export interface ModelConstructor<M extends BaseModelInterface> {
    new (): M;
}
