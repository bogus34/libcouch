"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DbError_1 = require("./DbError");
class ModelError extends Error {
}
exports.ModelError = ModelError;
class BaseStore {
    toId(instanceId) {
        if (typeof instanceId == 'string' && instanceId.startsWith(this.mapper.prefix)) {
            return instanceId;
        }
        else {
            return this.makeId(instanceId);
        }
    }
    makeId(instanceId) {
        return `${this.mapper.prefix}:${instanceId}`;
    }
    toInstanceId(id) {
        if (typeof id == 'string' && id.startsWith(this.mapper.prefix)) {
            return Number(id.substr(this.mapper.prefix.length + 1));
        }
        else {
            const numId = Number(id);
            return isNaN(numId) ? id : numId;
        }
    }
    create(data) {
        if (!data.id && !data._id) {
            throw new ModelError("Can't create model without id or _id");
        }
        const instance = new this.Model();
        instance.id = this.toId(data.id || data._id);
        instance.instanceId = this.toInstanceId(data.id || data._id);
        instance._rev = data._rev;
        instance.$created = data.$created;
        instance.$updated = data.$updated;
        instance.$type = data.$type || this.mapper.type;
        this.mapper.loadJSON(instance, data);
        return instance;
    }
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            id = this.toId(id);
            try {
                const data = yield this.db.get(id);
                return this.create(data);
            }
            catch (e) {
                if (e.error == 'not_found' || e.status == 404) {
                    return null;
                }
                else {
                    throw e;
                }
            }
        });
    }
    findOr404(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.find(id);
            if (result == null) {
                const e = new ModelError('Object not found');
                e.status = 404;
                e.expose = true;
                throw e;
            }
            return result;
        });
    }
    save(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            instance.$updated = Date.now();
            instance.$created = instance._rev ? instance.$created : Date.now();
            const data = this.mapper.dumpJSON(instance);
            const result = yield this.db.put(data);
            instance._rev = result.rev;
            return instance;
        });
    }
    bulkRemove(docs) {
        docs = docs.map((d) => ({
            _id: d.id,
            _rev: d._rev,
            _deleted: true
        }));
        return this.db.bulk(docs);
    }
    reload(model) {
        return this.findOr404(model.id);
    }
    modify(instance, fn) {
        return __awaiter(this, void 0, void 0, function* () {
            let newInstance = fn(instance);
            if (newInstance == null)
                return instance;
            try {
                return this.save(newInstance);
            }
            catch (e) {
                if (!(e instanceof DbError_1.DbError) || !e.isConflict()) {
                    throw e;
                }
                instance = yield this.reload(instance);
                newInstance = fn(instance);
                if (newInstance == null)
                    return instance;
                return this.save(newInstance);
            }
        });
    }
    remove(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            if (instance.id && instance._rev) {
                return this.db.remove(instance.id, instance._rev);
            }
        });
    }
}
exports.BaseStore = BaseStore;
class BaseModel {
}
exports.BaseModel = BaseModel;
class BaseMapper {
    constructor() {
        this.prefix = '';
        this.type = '';
    }
    loadJSON(model, data) {
        model.$type = data.$type || this.type;
    }
    dumpJSON(model) {
        return {
            _id: model.id,
            _rev: model._rev,
            $created: model.$created,
            $updated: model.$updated,
            $type: this.type
        };
    }
}
exports.BaseMapper = BaseMapper;
