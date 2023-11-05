import { WorkbenchHttpRequestData } from "../requests/WorkbenchHttpRequestData";

export type WorkbenchHttpResponseData = {
  id: string;
  
  request: WorkbenchHttpRequestData;
  requestedAt: string;

  result?: {
    headers: Record<string, string>;
    body?: string;
  };
};
