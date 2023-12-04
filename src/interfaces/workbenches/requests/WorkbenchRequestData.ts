import { WorkbenchHttpRequestData } from "./WorkbenchHttpRequestData";
import { WorkbenchEventBridgeRequestData } from "./aws/WorkbenchEventBridgeRequestData";

export type WorkbenchRequestData =
  | {
    id: string;
    name: string;
    type: "Request";
  }
  | WorkbenchHttpRequestData
  | WorkbenchEventBridgeRequestData;
