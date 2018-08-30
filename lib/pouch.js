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
const Path = require("path");
const Pouch = require("pouchdb-core");
const MapReduce = require("pouchdb-mapreduce");
const glob = require("glob");
const utils_1 = require("./utils");
const DbError_1 = require("./DbError");
Pouch.plugin(MapReduce);
class PouchConnector {
    constructor(adapter, viewsPath) {
        this.adapter = adapter;
        this.cache = {};
        this.views = {};
        if (viewsPath) {
            this.initViews(viewsPath);
        }
    }
    initViews(viewsPath) {
        let viewFiles = glob.sync(Path.join(viewsPath, '*'))
            .map((f) => Path.basename(f, Path.extname(f)));
        this.views = viewFiles.reduce((vs, f) => {
            let { views } = require(Path.join(viewsPath, f));
            vs[f] = views;
            return vs;
        }, {});
    }
    use(name) {
        if (this.cache[name])
            return this.cache[name];
        return this.cache[name] = new PouchDb(name, this.adapter, this.views);
    }
}
exports.PouchConnector = PouchConnector;
class PouchDb {
    constructor(dbName, adapter, views) {
        this.dbName = dbName;
        this.adapter = adapter;
        this.views = views;
        this.db = new Pouch(this.dbName, { adapter });
    }
    get(id, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.db.get(id, params);
            }
            catch (e) {
                throw new DbError_1.DbError(e);
            }
        });
    }
    getOrNull(id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.get(id, params);
            }
            catch (e) {
                if (e.status == 404) {
                    return null;
                }
                else {
                    throw e;
                }
            }
        });
    }
    list(params = {}) {
        try {
            return this.db.allDocs(params);
        }
        catch (e) {
            throw new DbError_1.DbError(e);
        }
    }
    put(doc) {
        try {
            if (!utils_1.isNil(doc._id)) {
                return this.db.put(doc);
            }
            else {
                return this.db.post(doc);
            }
        }
        catch (e) {
            throw new DbError_1.DbError(e);
        }
    }
    remove(id, rev) {
        if (utils_1.isNil(id) || utils_1.isNil(rev)) {
            return Promise.reject(new Error('Document id or revision not defined in remove'));
        }
        try {
            return this.db.remove({ _id: id, _rev: rev });
        }
        catch (e) {
            throw new DbError_1.DbError(e);
        }
    }
    view(design, view, params = {}) {
        const v = this.views && this.views[design] && this.views[design][view] ? this.views[design][view] : undefined;
        if (v) {
            try {
                return this.db.query(v, params);
            }
            catch (e) {
                throw new DbError_1.DbError(e);
            }
        }
        return Promise.reject(new Error(`No such view: ${design}/${view}`));
    }
    bulk(docs, params) {
        try {
            return this.db.bulkDocs(docs, params);
        }
        catch (e) {
            throw new DbError_1.DbError(e);
        }
    }
    destroyDb() {
        try {
            return this.db.destroy();
        }
        catch (e) {
            throw new DbError_1.DbError(e);
        }
    }
    createDb() {
        return Promise.resolve();
    }
}
exports.PouchDb = PouchDb;
