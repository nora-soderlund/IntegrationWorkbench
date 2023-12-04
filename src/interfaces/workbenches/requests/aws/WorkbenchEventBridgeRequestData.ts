import { UserInput } from "../../../UserInput";

export type WorkbenchEventBridgeRequestData = {
  id: string;
  name: string;
  type: "EventBridge";
  
  data: {
    eventBridgeArn: string;

    parameters: UserInput[];
    parametersAutoRefresh: boolean;
  };
};
