import { DBConnectorInterface, DBInterface, ID, Document, NanoConfig } from './interfaces';
import { ServerScope } from 'nano';
export declare class NanoConnector implements DBConnectorInterface {
    private url;
    private connection;
    private cache;
    constructor(config: NanoConfig);
    use(name: string): NanoDb;
}
export declare class NanoDb implements DBInterface {
    private connection;
    private dbName;
    private db;
    constructor(connection: ServerScope, dbName: string);
    get(id: ID, params: any): Promise<Document>;
    getOrNull(id: ID, params: any): Promise<Document | null>;
    list(params?: any): Promise<any>;
    put(doc: Document): Promise<{}>;
    remove(id: ID, rev: string): Promise<any>;
    view(design: string, view: string, params?: any): Promise<any>;
    bulk(docs: Document[], params?: any): Promise<any>;
}
