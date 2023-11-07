import { WorkbenchHttpAuthorization, WorkbenchHttpBasicAuthorization, WorkbenchHttpNoneAuthorization, WorkbenchHttpRequestApplicationJsonBodyData, WorkbenchHttpRequestBodyData, WorkbenchHttpRequestData, WorkbenchHttpRequestNoneBodyData, WorkbenchHttpRequestRawBodyData } from "../WorkbenchHttpRequestData";

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

export function isHttpRequestNoneAuthorizationData(authorization: WorkbenchHttpAuthorization): authorization is WorkbenchHttpNoneAuthorization {
  return authorization.type === "none";
}

export function isHttpRequestBasicAuthorizationData(authorization: WorkbenchHttpAuthorization): authorization is WorkbenchHttpBasicAuthorization {
  return authorization.type === "basic";
}

export function isHttpRequestBearerAuthorizationData(authorization: WorkbenchHttpAuthorization): authorization is WorkbenchHttpBasicAuthorization {
  return authorization.type === "bearer";
}
