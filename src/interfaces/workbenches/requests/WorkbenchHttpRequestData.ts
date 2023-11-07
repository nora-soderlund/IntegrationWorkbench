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

export type WorkbenchHttpRequestData = {
  id: string;
  name: string;
  type: "HTTP";
  
  data: {
    method: string;
    url?: string;

    headers: WorkbenchHttpRequestHeaderData[];

    body: WorkbenchHttpRequestBodyData;
  };
};
