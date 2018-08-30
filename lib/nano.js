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
const nano = require("nano");
const utils_1 = require("./utils");
const DbError_1 = require("./DbError");
class NanoConnector {
    constructor(config) {
        this.cache = {};
        const host = config.host || 'localhost';
        const port = config.port || 5984;
        const protocol = config.protocol || 'http';
        if (config.username) {
            const { username, password } = config;
            this.url = `${protocol}://${username}:${password}@${host}:${port}`;
        }
        else {
            this.url = `${protocol}://${host}:${port}`;
        }
        this.connection = nano({ url: this.url });
    }
    use(name) {
        if (!this.connection) {
            this.connection = nano(this.url);
        }
        if (this.cache[name])
            return this.cache[name];
        return this.cache[name] = new NanoDb(this.connection, name);
    }
}
exports.NanoConnector = NanoConnector;
class NanoDb {
    constructor(connection, dbName) {
        this.connection = connection;
        this.dbName = dbName;
        this.db = this.connection.use(dbName);
    }
    get(id, params) {
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
                if (e.statusCode == 404 || e.status == 404) {
                    return null;
                }
                else {
                    throw e;
                }
            }
        });
    }
    list(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.db.list(params);
            }
            catch (e) {
                throw new DbError_1.DbError(e);
            }
        });
    }
    put(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.db.insert(doc, {});
            }
            catch (e) {
                throw new DbError_1.DbError(e);
            }
        });
    }
    remove(id, rev) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.isNil(id) || utils_1.isNil(rev)) {
                throw new Error('Document id or revision not defined in remove');
            }
            try {
                return yield this.db.destroy(id, rev);
            }
            catch (e) {
                throw new DbError_1.DbError(e);
            }
        });
    }
    view(design, view, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.db.view(design, view, params);
            }
            catch (e) {
                throw new DbError_1.DbError(e);
            }
        });
    }
    bulk(docs, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.db.bulk({ docs }, params);
            }
            catch (e) {
                throw new DbError_1.DbError(e);
            }
        });
    }
    destroyDb() {
        try {
            return this.connection.db.destroy(this.dbName);
        }
        catch (e) {
            throw new DbError_1.DbError(e);
        }
    }
    createDb() {
        try {
            return this.connection.db.create(this.dbName);
        }
        catch (e) {
            throw new DbError_1.DbError(e);
        }
    }
}
exports.NanoDb = NanoDb;
