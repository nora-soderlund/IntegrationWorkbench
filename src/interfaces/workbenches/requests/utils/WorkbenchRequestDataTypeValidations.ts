import { WorkbenchHttpRequestData } from "../WorkbenchHttpRequestData";

export function isHttpRequestData(requestData: Record<string, unknown>): requestData is WorkbenchHttpRequestData {
  return requestData.type === "HTTP";
}
