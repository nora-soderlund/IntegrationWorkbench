import CreateCollectionCommand from '../commands/collections/CreateCollectionCommand';
import CreateRequestCommand from '../commands/requests/CreateRequestCommand';
import OpenRequestCommand from '../commands/requests/OpenRequestCommand';
import CreateWorkbenchCommand from '../commands/workbenches/CreateWorkbenchCommand';
import OpenResponseCommand from '../commands/responses/OpenResponseCommand';
import EditCollectionNameCommand from '../commands/collections/EditCollectionNameCommand';
import EditCollectionDescriptionCommand from '../commands/collections/EditCollectionDescriptionCommand';
import EditRequestNameCommand from '../commands/requests/EditRequestNameCommand';
import RunCollectionCommand from '../commands/collections/RunCollectionCommand';
import RunRequestCommand from '../commands/requests/RunRequestCommand';
import DeleteRequestCommand from '../commands/requests/DeleteRequestCommand';
import DeleteCollectionCommand from '../commands/collections/DeleteCollectionCommand';
import DeleteWorkbenchCommand from '../commands/workbenches/DeleteWorkbenchCommand';
import RunWorkbenchCommand from '../commands/workbenches/RunWorkbenchCommand';
import CreateScriptCommand from '../commands/scripts/CreateScriptCommand';
import OpenScriptCommand from '../commands/scripts/OpenScriptCommand';
import EditScriptNameCommand from '../commands/scripts/EditScriptNameCommand';
import EditWorkbenchNameCommand from '../commands/workbenches/EditWorkbenchNameCommand';
import EditWorkbenchDescriptionCommand from '../commands/workbenches/EditWorkbenchDescriptionCommand';
import DeleteScriptCommand from '../commands/scripts/DeleteScriptCommand';
import CancelResponseCommand from '../commands/responses/CancelResponseCommand';
import CreateEnvironmentCommand from '../commands/environments/CreateEnvironmentCommand';
import DeleteEnvironmentCommand from '../commands/environments/DeleteEnvironmentCommand';
import EditEnvironmentNameCommand from '../commands/environments/EditEnvironmentNameCommand';
import EditEnvironmentDescriptionCommand from '../commands/environments/EditEnvironmentDescriptionCommand';
import SelectEnvironmentCommand from '../commands/environments/SelectEnvironmentCommand';
import OpenEnvironmentCommand from '../commands/environments/OpenEnvironmentCommand';
import { ExtensionContext } from 'vscode';

export default class Commands {
  public static register(context: ExtensionContext) {
    new CreateCollectionCommand(context);
    new EditCollectionNameCommand(context);
    new EditCollectionDescriptionCommand(context);
    new RunCollectionCommand(context);
    new DeleteCollectionCommand(context);
    
    new CreateRequestCommand(context);
    new OpenRequestCommand(context);
    new EditRequestNameCommand(context);
    new RunRequestCommand(context);
    new DeleteRequestCommand(context);

    new OpenResponseCommand(context);
    new CancelResponseCommand(context);

    new CreateWorkbenchCommand(context);
    new DeleteWorkbenchCommand(context);
    new RunWorkbenchCommand(context);
    new EditWorkbenchNameCommand(context);
    new EditWorkbenchDescriptionCommand(context);

    new CreateScriptCommand(context);
    new OpenScriptCommand(context);
    new EditScriptNameCommand(context);
    new DeleteScriptCommand(context);

    new CreateEnvironmentCommand(context);
    new EditEnvironmentNameCommand(context);
    new EditEnvironmentDescriptionCommand(context);
    new DeleteEnvironmentCommand(context);
    new OpenEnvironmentCommand(context);

    new SelectEnvironmentCommand(context);
  }
}
