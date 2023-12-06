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
  const [ requestData, setRequestData ] = useState<WorkbenchRequestData | null>(null);
  const [ handlerState, setHandlerState ] = useState<HandlerState<unknown> | null>(null);

  useEffect(() => {
    window.addEventListener('message', event => {
      const { command } = event.data;

      switch (command) {
        case 'norasoderlund.integrationworkbench.showResponse': {
          const [ requestData, handlerState ] = event.data.arguments;

          setRequestData(requestData);
          setHandlerState(handlerState);
  
          break;
        }
      }
    });
  }, []);

  if(requestData && handlerState) {
    if(isHttpRequestData(requestData)) {
      return (
        <HttpResponse key={requestData.id} requestData={requestData} handlerState={handlerState as HttpHandlerState}/>
      );
    }
    else if(isEventBridgeRequestData(requestData)) {
      return (
        <EventBridgeResponse key={requestData.id} requestData={requestData} handlerState={handlerState as HandlerState<EventBridgeHandlerFulfilledState>}/>
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
