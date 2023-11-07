import { WorkbenchHttpRequestData } from "../requests/WorkbenchHttpRequestData";
import { WorkbenchResponseStatus } from "./WorkbenchResponseStatus";

export type WorkbenchHttpResponseData = {
  id: string;
  status: WorkbenchResponseStatus;
  
  request: WorkbenchHttpRequestData;
  requestedAt: string;

  error?: string;

  result?: {
    status: number;
    statusText: string;
    
    headers: Record<string, string>;
    body?: string;
  };
};
