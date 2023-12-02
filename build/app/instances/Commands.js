"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreateCollectionCommand_1 = __importDefault(require("../commands/collections/CreateCollectionCommand"));
const CreateRequestCommand_1 = __importDefault(require("../commands/requests/CreateRequestCommand"));
const OpenRequestCommand_1 = __importDefault(require("../commands/requests/OpenRequestCommand"));
const CreateWorkbenchCommand_1 = __importDefault(require("../commands/workbenches/CreateWorkbenchCommand"));
const OpenResponseCommand_1 = __importDefault(require("../commands/responses/OpenResponseCommand"));
const EditCollectionNameCommand_1 = __importDefault(require("../commands/collections/EditCollectionNameCommand"));
const EditCollectionDescriptionCommand_1 = __importDefault(require("../commands/collections/EditCollectionDescriptionCommand"));
const EditRequestNameCommand_1 = __importDefault(require("../commands/requests/EditRequestNameCommand"));
const RunCollectionCommand_1 = __importDefault(require("../commands/collections/RunCollectionCommand"));
const RunRequestCommand_1 = __importDefault(require("../commands/requests/RunRequestCommand"));
const DeleteRequestCommand_1 = __importDefault(require("../commands/requests/DeleteRequestCommand"));
const DeleteCollectionCommand_1 = __importDefault(require("../commands/collections/DeleteCollectionCommand"));
const DeleteWorkbenchCommand_1 = __importDefault(require("../commands/workbenches/DeleteWorkbenchCommand"));
const RunWorkbenchCommand_1 = __importDefault(require("../commands/workbenches/RunWorkbenchCommand"));
const CreateScriptCommand_1 = __importDefault(require("../commands/scripts/CreateScriptCommand"));
const OpenScriptCommand_1 = __importDefault(require("../commands/scripts/OpenScriptCommand"));
const EditScriptNameCommand_1 = __importDefault(require("../commands/scripts/EditScriptNameCommand"));
const EditWorkbenchNameCommand_1 = __importDefault(require("../commands/workbenches/EditWorkbenchNameCommand"));
const EditWorkbenchDescriptionCommand_1 = __importDefault(require("../commands/workbenches/EditWorkbenchDescriptionCommand"));
const DeleteScriptCommand_1 = __importDefault(require("../commands/scripts/DeleteScriptCommand"));
const CancelResponseCommand_1 = __importDefault(require("../commands/responses/CancelResponseCommand"));
const CreateEnvironmentCommand_1 = __importDefault(require("../commands/environments/CreateEnvironmentCommand"));
const DeleteEnvironmentCommand_1 = __importDefault(require("../commands/environments/DeleteEnvironmentCommand"));
const EditEnvironmentNameCommand_1 = __importDefault(require("../commands/environments/EditEnvironmentNameCommand"));
const EditEnvironmentDescriptionCommand_1 = __importDefault(require("../commands/environments/EditEnvironmentDescriptionCommand"));
const SelectEnvironmentCommand_1 = __importDefault(require("../commands/environments/SelectEnvironmentCommand"));
const OpenEnvironmentCommand_1 = __importDefault(require("../commands/environments/OpenEnvironmentCommand"));
class Commands {
    static register(context) {
        new CreateCollectionCommand_1.default(context);
        new EditCollectionNameCommand_1.default(context);
        new EditCollectionDescriptionCommand_1.default(context);
        new RunCollectionCommand_1.default(context);
        new DeleteCollectionCommand_1.default(context);
        new CreateRequestCommand_1.default(context);
        new OpenRequestCommand_1.default(context);
        new EditRequestNameCommand_1.default(context);
        new RunRequestCommand_1.default(context);
        new DeleteRequestCommand_1.default(context);
        new OpenResponseCommand_1.default(context);
        new CancelResponseCommand_1.default(context);
        new CreateWorkbenchCommand_1.default(context);
        new DeleteWorkbenchCommand_1.default(context);
        new RunWorkbenchCommand_1.default(context);
        new EditWorkbenchNameCommand_1.default(context);
        new EditWorkbenchDescriptionCommand_1.default(context);
        new CreateScriptCommand_1.default(context);
        new OpenScriptCommand_1.default(context);
        new EditScriptNameCommand_1.default(context);
        new DeleteScriptCommand_1.default(context);
        new CreateEnvironmentCommand_1.default(context);
        new EditEnvironmentNameCommand_1.default(context);
        new EditEnvironmentDescriptionCommand_1.default(context);
        new DeleteEnvironmentCommand_1.default(context);
        new OpenEnvironmentCommand_1.default(context);
        new SelectEnvironmentCommand_1.default(context);
    }
}
exports.default = Commands;
//# sourceMappingURL=Commands.js.map