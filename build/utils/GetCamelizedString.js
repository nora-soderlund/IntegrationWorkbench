"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Authored by Christian C. Salvadó
// https://stackoverflow.com/a/2970667/20073186
function getCamelizedString(string) {
    return string.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        }
        return word.toUpperCase();
    }).replace(/\s+/g, '');
}
exports.default = getCamelizedString;
;
//# sourceMappingURL=GetCamelizedString.js.map