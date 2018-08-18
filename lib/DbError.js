"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DbError extends Error {
    constructor(srcError) {
        super(srcError.reason);
        this.status = srcError.statusCode ? srcError.statusCode : srcError.status;
        this.name = srcError.error || srcError.name;
        this.stack = srcError.stack;
    }
    isConflict() {
        return this.status == 409;
    }
}
exports.DbError = DbError;
