import { WorkbenchRequestData } from "~interfaces/workbenches/requests/WorkbenchRequestData";
import RequestWebview from "./RequestWebview";
import { Workbench } from "../workbenches/Workbench";
import { WorkbenchCollection } from "../collections/WorkbenchCollection";

export default interface WorkbenchRequest {
  id: string;
  name: string;
  webview: RequestWebview;
  parent: Workbench | WorkbenchCollection | null;

  getData(): WorkbenchRequestData;

  send(): void;

  setName(name: string): void;
};
