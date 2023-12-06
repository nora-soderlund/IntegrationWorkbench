import { useEffect, useState } from "react";
import { isEventBridgeRequestData, isHttpRequestData } from "../../../interfaces/workbenches/requests/utils/WorkbenchRequestDataTypeValidations";
import { WorkbenchRequestData } from "../../../interfaces/workbenches/requests/WorkbenchRequestData";
import { WorkbenchResponseData } from "../../../interfaces/workbenches/responses/WorkbenchResponseData";
import { isHttpResponseData } from "../../../interfaces/workbenches/responses/utils/WorkbenchResponseTypeValidations";
import HttpResponse from "./http/HttpResponse";
import { HandlerState } from "../../../interfaces/entities/handlers/Handler";
import { HttpHandlerFulfilledState } from "../../../../src/interfaces/entities/handlers/http/HttpHandlerFulfilledState";
import EventBridgeResponse from "./aws/EventBridgeResponse";
import { EventBridgeHandlerFulfilledState } from "../../../interfaces/entities/handlers/aws/EventBridgeHandlerFulfilledState";
import { HttpHandlerState } from "../../../interfaces/entities/handlers/http/HttpHandlerState";

export default function Response() {
  const [ data, setData ] = useState<{
    requestData: WorkbenchRequestData,
    handlerState: HandlerState<unknown>
  } | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'norasoderlund.integrationworkbench.showResponse': {
          const [ requestData, handlerState ] = event.data.arguments;

          setData({ requestData, handlerState });
  
          break;
        }
      }
    });
  }, []);

  if(data) {
    if(isHttpRequestData(data.requestData)) {
      return (
        <HttpResponse key={data.requestData.id} requestData={data.requestData} handlerState={data.handlerState as HttpHandlerState}/>
      );
    }
    else if(isEventBridgeRequestData(data.requestData)) {
      return (
        <EventBridgeResponse key={data.requestData.id} requestData={data.requestData} handlerState={data.handlerState as HandlerState<EventBridgeHandlerFulfilledState>}/>
      );
    }
  }

  return (
    <div style={{
      padding: "0 20px"
    }}>
      <p>No response is selected.</p>
    </div>
  );
};
