import { WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestBodyData, WorkbenchHttpRequestData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../WorkbenchHttpRequestData";

export function isHttpRequestData(requestData: Record<string, unknown>): requestData is WorkbenchHttpRequestData {
  return requestData.type === "HTTP";
}

export function isHttpRequestNoneBodyData(bodyData: WorkbenchHttpRequestBodyData): bodyData is WorkbenchHttpRequestNoneBodyData {
  return bodyData.type === "none";
}

export function isHttpRequestRawBodyData(bodyData: WorkbenchHttpRequestBodyData): bodyData is WorkbenchHttpRequestRawBodyData {
  return bodyData.type === "raw";
}

export function isHttpRequestApplicationJsonBodyData(bodyData: WorkbenchHttpRequestBodyData): bodyData is WorkbenchHttpRequestApplicationJsonBodyData {
  return bodyData.type === "application/json";
}
