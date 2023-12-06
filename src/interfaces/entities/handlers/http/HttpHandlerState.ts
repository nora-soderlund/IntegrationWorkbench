import { HandlerState } from "../Handler";
import { HttpHandlerFulfilledState } from "./HttpHandlerFulfilledState";

export type HttpHandlerState = HandlerState<HttpHandlerFulfilledState> & {
  request?: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: string;
  };
};
