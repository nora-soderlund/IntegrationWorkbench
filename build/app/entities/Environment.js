"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class Environment {
    constructor(filePath) {
        this.filePath = filePath;
        this.data = JSON.parse((0, fs_1.readFileSync)(this.filePath, {
            encoding: "utf-8"
        }));
    }
    save() {
        (0, fs_1.writeFileSync)(this.filePath, JSON.stringify(this.data, undefined, 2), {
            encoding: "utf-8"
        });
    }
    delete() {
        (0, fs_1.rmSync)(this.filePath);
    }
}
exports.default = Environment;
//# sourceMappingURL=Environment.js.map