import { HandlerState } from "../Handler";
import { EventBridgeHandlerFulfilledState } from "./EventBridgeHandlerFulfilledState";

export type EventBridgeHandlerState = HandlerState<EventBridgeHandlerFulfilledState> & {
  request?: {
    arn: string;
    region: string;
    detailType: string;
    eventSource: string;
    resources: string[];
    body: string;
  };
};
