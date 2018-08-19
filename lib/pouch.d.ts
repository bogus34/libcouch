/// <reference types="pouchdb-find" />
/// <reference types="pouchdb-core" />
/// <reference types="pouchdb-mapreduce" />
/// <reference types="pouchdb-replication" />
import { DBConnectorInterface, DBInterface, ID, Document } from './interfaces';
export declare class PouchConnector implements DBConnectorInterface {
    protected adapter: string;
    protected cache: {
        [name: string]: PouchDb;
    };
    protected views: {
        [name: string]: any;
    };
    constructor(adapter: string, viewsPath?: string);
    protected initViews(viewsPath: string): void;
    use(name: string): DBInterface;
}
export declare class PouchDb implements DBInterface {
    protected dbName: string;
    protected adapter: string;
    protected views: any;
    protected db: PouchDB.Database;
    constructor(dbName: string, adapter: string, views: any);
    get(id: ID, params?: any): Promise<PouchDB.Core.IdMeta & PouchDB.Core.GetMeta>;
    getOrNull(id: ID, params: any): Promise<Document | null>;
    list(params?: any): Promise<any>;
    put(doc: Document): Promise<PouchDB.Core.Response>;
    remove(id: ID, rev: string): Promise<PouchDB.Core.Response>;
    view(design: string, view: string, params?: PouchDB.Query.Options<any, any>): Promise<any>;
    bulk(docs: Document[], params?: any): Promise<any>;
}
