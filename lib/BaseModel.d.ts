import { ID, Document, DBInterface, MapperInterface, ModelConstructor, BaseDoc, BaseModelInterface } from './interfaces';
export declare class ModelError extends Error {
    status: number;
    expose: boolean;
}
export declare abstract class BaseStore<M extends BaseModelInterface, D extends BaseDoc> {
    protected db: DBInterface;
    protected mapper: MapperInterface<M, D>;
    protected Model: ModelConstructor<M>;
    toId(instanceId: any): ID;
    makeId(instanceId: any): ID;
    toInstanceId(id: ID | number): string | number;
    create(data: D): M;
    find(id: any): Promise<M | null>;
    findOr404(id: any): Promise<M>;
    save(instance: M): Promise<M>;
    bulkRemove(docs: Document[]): Promise<any>;
    reload(model: M): Promise<M>;
    modify(instance: M, fn: (instance: M) => M | null): Promise<M>;
    remove(instance: M): Promise<void>;
}
export declare abstract class BaseModel implements BaseModelInterface {
    id: string;
    instanceId: string | number;
    _rev?: string;
    $type: string;
    $created?: number;
    $updated?: number;
}
export declare abstract class BaseMapper implements MapperInterface<BaseModel, BaseDoc> {
    prefix: string;
    type: string;
    loadJSON(model: BaseModel, data: any): void;
    dumpJSON(model: BaseModel): BaseDoc;
}
