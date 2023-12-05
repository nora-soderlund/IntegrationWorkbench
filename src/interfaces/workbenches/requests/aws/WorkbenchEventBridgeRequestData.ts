import { UserInput } from "../../../UserInput";
import { WorkbenchEventBridgeRequestTimeData } from "./WorkbenchEventBridgeRequestTimeData";

export type WorkbenchEventBridgeRequestData = {
  id: string;
  name: string;
  type: "EventBridge";
  
  data: {
    eventBridgeArn: string;

    detailType: UserInput;
    eventSource: UserInput;
    resources: UserInput[];
    time: WorkbenchEventBridgeRequestTimeData;

    body: UserInput;

    parameters: UserInput[];
    parametersAutoRefresh: boolean;
  };
};
