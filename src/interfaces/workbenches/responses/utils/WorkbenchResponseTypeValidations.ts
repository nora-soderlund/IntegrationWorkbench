import { WorkbenchHttpResponseData } from "../WorkbenchHttpResponseData";

export function isHttpResponseData(responseData: unknown): responseData is WorkbenchHttpResponseData {
  return (responseData as WorkbenchHttpResponseData).request.type === "HTTP";
}
