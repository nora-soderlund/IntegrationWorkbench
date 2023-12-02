"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WorkbenchTreeItem_1 = __importDefault(require("../../views/trees/workbenches/items/WorkbenchTreeItem"));
const Workbenches_1 = require("../../instances/Workbenches");
const Command_1 = __importDefault(require("../Command"));
class DeleteWorkbenchCommand extends Command_1.default {
    constructor(context) {
        super(context, 'integrationWorkbench.deleteWorkbench');
    }
    handle(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            let workbench;
            if (reference instanceof WorkbenchTreeItem_1.default) {
                workbench = reference.workbench;
            }
            else {
                throw new Error("Unknown entry point for deleting workbench.");
            }
            workbench.collections.forEach((collection) => workbench.removeCollection(collection));
            workbench.requests.forEach((request) => workbench.removeRequest(request));
            workbench.delete();
            (0, Workbenches_1.scanForWorkbenches)(this.context, true);
        });
    }
}
exports.default = DeleteWorkbenchCommand;
//# sourceMappingURL=DeleteWorkbenchCommand.js.map