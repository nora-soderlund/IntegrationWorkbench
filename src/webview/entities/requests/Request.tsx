import { useEffect, useState } from "react";
import { isEventBridgeRequestData, isHttpRequestData } from "../../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import { WorkbenchRequestData } from "../../../interfaces/workbenches/requests/WorkbenchRequestData";
import HttpRequest from "./http/HttpRequest";
import EventBridgeRequest from "./aws/EventBridgeRequest";

export default function Request() {
  const [ requestData, setRequestData ] = useState<WorkbenchRequestData | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'norasoderlund.integrationworkbench.updateRequest': {
          const [ requestData ] = event.data.arguments;

          setRequestData(requestData);
  
          break;
        }
      }
    });

    window.vscode.postMessage({
      command: "norasoderlund.integrationworkbench.getRequest",
      arguments: []
    });
  }, []);

  if(requestData) {
    if(isHttpRequestData(requestData)) {
      return (
        <HttpRequest requestData={requestData}/>
      );
    }
    else if(isEventBridgeRequestData(requestData)) {
      return (
        <EventBridgeRequest requestData={requestData}/>
      );
    }
  }

  return (
    <div>
      <h1>TBD</h1>
    </div>
  );
};
