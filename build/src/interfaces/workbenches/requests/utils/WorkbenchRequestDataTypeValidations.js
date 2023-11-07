"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHttpRequestApplicationJsonBodyData = exports.isHttpRequestRawBodyData = exports.isHttpRequestNoneBodyData = exports.isHttpRequestData = void 0;
function isHttpRequestData(requestData) {
    return requestData.type === "HTTP";
}
exports.isHttpRequestData = isHttpRequestData;
function isHttpRequestNoneBodyData(bodyData) {
    return bodyData.type === "none";
}
exports.isHttpRequestNoneBodyData = isHttpRequestNoneBodyData;
function isHttpRequestRawBodyData(bodyData) {
    return bodyData.type === "raw";
}
exports.isHttpRequestRawBodyData = isHttpRequestRawBodyData;
function isHttpRequestApplicationJsonBodyData(bodyData) {
    return bodyData.type === "application/json";
}
exports.isHttpRequestApplicationJsonBodyData = isHttpRequestApplicationJsonBodyData;
//# sourceMappingURL=WorkbenchRequestDataTypeValidations.js.map