"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DbError_1 = require("./DbError");
function stdCallback(resolve, reject) {
    return (err, data) => {
        if (err) {
            reject(new DbError_1.DbError(err));
        }
        else {
            resolve(data);
        }
    };
}
exports.stdCallback = stdCallback;
function isNil(v) {
    return typeof v == 'undefined' || v === null;
}
exports.isNil = isNil;
