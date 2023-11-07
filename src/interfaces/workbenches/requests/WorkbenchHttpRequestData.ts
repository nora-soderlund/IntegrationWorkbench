export type WorkbenchHttpRequestNoneBodyData = {
  type: "none";
};

export type WorkbenchHttpRequestRawBodyData = {
  type: "raw";
  body: string;
};

export type WorkbenchHttpRequestApplicationJsonBodyData = {
  type: "application/json";
  body: string;
};

export type WorkbenchHttpRequestBodyData = 
  | WorkbenchHttpRequestNoneBodyData
  | WorkbenchHttpRequestRawBodyData
  | WorkbenchHttpRequestApplicationJsonBodyData;

export type WorkbenchHttpRequestHeaderData = {
  name: string;
  value: string;
};

export type WorkbenchHttpRequestParameterData = {
  name: string;
  value: string;
};

export type WorkbenchHttpNoneAuthorization = {
  type: "none";
};

export type WorkbenchHttpBasicAuthorization = {
  type: "basic";
  
  username: string;
  password: string;
};

export type WorkbenchHttpAuthorization = 
  | WorkbenchHttpNoneAuthorization
  | WorkbenchHttpBasicAuthorization;

export type WorkbenchHttpRequestData = {
  id: string;
  name: string;
  type: "HTTP";
  
  data: {
    method: string;
    url?: string;

    authorization: WorkbenchHttpAuthorization;

    headers: WorkbenchHttpRequestHeaderData[];
    parameters: WorkbenchHttpRequestParameterData[];

    body: WorkbenchHttpRequestBodyData;
  };
};
